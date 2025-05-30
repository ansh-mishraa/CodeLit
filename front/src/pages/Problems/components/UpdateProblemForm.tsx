import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { problemSchema } from "@/schema/problemSchema";
import { Loader2, CheckCircle2 } from "lucide-react";

// Types
const LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA"] as const;
type ProblemFormType = z.infer<typeof problemSchema>;

const UpdateProblemForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProblemFormType>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [],
      constraints: "",
      hints: "",
      editorial: "",
      testCases: [{ input: "", output: "" }],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "",
        PYTHON: "",
        JAVA: "",
      },
      referenceSolutions: {
        JAVASCRIPT: "",
        PYTHON: "",
        JAVA: "",
      },
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray<ProblemFormType, any>({
    control,
    name: "tags",
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray<ProblemFormType, any>({
    control,
    name: "testCases",
  });

useEffect(() => {
  const fetchProblem = async () => {
    try {
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      const data: ProblemFormType = res.data;
        console.log("Fetched problem data:", data);
      // Split arrays from base form values
      const { tags, testCases, ...rest } = data;

      // Reset form (excluding field arrays)
      reset(rest);

      // Replace field arrays manually
      replaceTags(tags);
      replaceTestCases(testCases);
    } catch (err) {
      toast.error("Failed to load problem data");
    } finally {
      setIsFetching(false);
    }
  };


  fetchProblem();
  
}, [id, reset, replaceTags, replaceTestCases]);
console.log("UpdateProblemForm rendered with id:", id);

  const onSubmit = async (formData: ProblemFormType) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.patch(`/update-problem/${id}`, formData);
      toast.success(res.data.message || "Problem updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update problem");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading Problem...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Problem</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* TITLE, DESCRIPTION, DIFFICULTY */}
        <input
          className="input input-bordered w-full"
          {...register("title")}
          placeholder="Problem title"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <textarea
          className="textarea textarea-bordered w-full h-32"
          {...register("description")}
          placeholder="Problem description"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <select {...register("difficulty")} className="select select-bordered w-full">
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        {/* Tags */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Tags</h2>
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                className="input input-bordered flex-1"
                {...register(`tags.${index}`)}
              />
              <button
                type="button"
                className="btn btn-error"
                onClick={() => removeTag(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn" onClick={() => appendTag("")}>
            Add Tag
          </button>
        </div>

        {/* Test Cases */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
          {testCaseFields.map((field, index) => (
            <div key={field.id} className="grid md:grid-cols-2 gap-4 mb-4">
              <textarea
                className="textarea textarea-bordered"
                {...register(`testCases.${index}.input`)}
                placeholder="Test case input"
              />
              <textarea
                className="textarea textarea-bordered"
                {...register(`testCases.${index}.output`)}
                placeholder="Expected output"
              />
              <button
                type="button"
                className="btn btn-error col-span-2"
                onClick={() => removeTestCase(index)}
              >
                Remove Test Case
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn"
            onClick={() => appendTestCase({ input: "", output: "" })}
          >
            Add Test Case
          </button>
        </div>

        {/* Code Snippets, Reference Solutions, Examples */}
        {LANGUAGES.map((lang) => (
          <div key={lang}>
            <h2 className="text-xl font-bold mb-2">{lang}</h2>

            <label className="font-semibold">Starter Code:</label>
            <Controller
              name={`codeSnippets.${lang}` as const}
              control={control}
              render={({ field }) => (
                <Editor
                  height="200px"
                  language={lang.toLowerCase()}
                  theme="vs-dark"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.codeSnippets?.[lang] && (
              <p className="text-red-500">{errors.codeSnippets[lang]?.message}</p>
            )}

            <label className="font-semibold">Reference Solution:</label>
            <Controller
              name={`referenceSolutions.${lang}` as const}
              control={control}
              render={({ field }) => (
                <Editor
                  height="200px"
                  language={lang.toLowerCase()}
                  theme="vs-dark"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.referenceSolutions?.[lang] && (
              <p className="text-red-500">{errors.referenceSolutions[lang]?.message}</p>
            )}
          </div>
        ))}

        {/* Constraints, Hints, Editorial */}
        <textarea
          className="textarea textarea-bordered"
          {...register("constraints")}
          placeholder="Constraints"
        />
        {errors.constraints && (
          <p className="text-red-500">{errors.constraints.message}</p>
        )}

        <textarea
          className="textarea textarea-bordered"
          {...register("hints")}
          placeholder="Hints (optional)"
        />
        <textarea
          className="textarea textarea-bordered"
          {...register("editorial")}
          placeholder="Editorial (optional)"
        />

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Update Problem
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProblemForm;
