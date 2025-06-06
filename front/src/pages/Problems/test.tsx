import React, { useState, useEffect } from "react";
import logo from "@/assets/dark.svg";
import Editor from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "@/store/useProblemStore";
import { getLanguageId } from "@/lib/lang";
import { useExecutionStore } from "@/store/useExecutionStore";
import { useSubmissionStore } from "@/store/useSubmissionStore";
import Submission from "./components/Submission";
import SubmissionsList from "./components/SubmissionList";
import { ModeToggle } from "@/components/mode-toggle";
import DiscussionList from "./components/DiscussionList";
import ProblemHints from "./components/HintList";

const ProblemPage = () => {
  const { id } = useParams();

  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  interface TestCase {
    input: string;
    output: string;
  }

  const [testcases, setTestCases] = useState<TestCase[]>([]);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id as any);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testCases?.map((tc: any) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  console.log("submission", submission);

  const handleLanguageChange = (e: any) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e: any) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage) as number;
      const stdin = problem.testCases.map((tc: any) => tc.input);
      const expected_outputs = problem.testCases.map((tc: any) => tc.output);
      console.log(id, "id");

      executeCode(code, language_id, stdin, expected_outputs, id as any);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };
  console.log(isProblemLoading, problem, "Test");

  if (isProblemLoading || !problem) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img className="animate-pulse" src={logo} width={90}></img>
        <div className="mt-3 text-2xl animate-pulse text-orange-300 font-bold">
          CodeLit
        </div>
        <Loader2 className="animate-spin mt-4 text-2xl  text-orange-300" />
      </div>
    );
  }
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none text-sm md:text-base text-base-content">
            {/* Problem Description */}
            <p className="text-sm md:text-sm mb-6">{problem.description}</p>

            {/* Examples */}
            {problem.examples && (
              <>
                <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-4">
                  Examples
                </h3>

                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => {
                    const ex = example as {
                      input: string;
                      output: string;
                      explanation?: string;
                    };

                    return (
                      <div
                        key={lang}
                        className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 md:p-5 rounded-xl mb-6"
                      >
                        {/* Input */}
                        <div className="mb-3">
                          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1 uppercase">
                            Input
                          </div>
                          <pre className="bg-white dark:bg-black/80 text-black dark:text-white px-3 py-1.5 rounded-md text-xs font-mono overflow-auto">
                            {ex.input}
                          </pre>
                        </div>

                        {/* Output */}
                        <div className="mb-3">
                          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1 uppercase">
                            Output
                          </div>
                          <pre className="bg-white dark:bg-black/80 text-black dark:text-white px-3 py-1.5 rounded-md text-xs font-mono overflow-auto">
                            {ex.output}
                          </pre>
                        </div>

                        {/* Explanation (optional) */}
                        {ex.explanation && (
                          <div>
                            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 uppercase">
                              Explanation
                            </div>
                            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-snug">
                              {ex.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <>
                <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-3">
                  Constraints
                </h3>
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 md:p-5 rounded-xl">
                  <pre className="bg-white dark:bg-black/80 text-black dark:text-white px-3 py-1.5 rounded-md text-sm font-mono overflow-auto">
                    {problem.constraints}
                  </pre>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <DiscussionList
            discussions={[
              {
                name: "Test",
                message: "Test",
                createdAt: "2023-01-01T00:00:00.000Z",
                upvotes: 0,
                downvotes: 0,
              },
            ]}
            isLoading={false}
          />
        );
      case "hints":
        return <ProblemHints hints={problem.hints} />;
      default:
        return null;
    }
  };
  console.log(testcases, "testcases");

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full p-0 ">
      {/* Navigation Bar */}
      <nav className="bg-base-100 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center gap-4 text-primary w-full max-w-[75%]">
            <Link to="/" className="flex items-center gap-2 hover:underline">
              <Home className="w-5 h-5" />
              <ChevronRight className="w-4 h-4" />
            </Link>
            <ModeToggle />
            <h1 className="text-lg md:text-xl font-semibold truncate">
              {problem.title}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              className={`btn btn-ghost btn-circle ${
                isBookmarked ? "text-primary" : ""
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="btn btn-ghost btn-circle" aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Metadata
      <div className="max-w-7xl mx-auto px-6 mt-2 text-xs text-base-content/70 flex flex-wrap gap-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className="text-xs">
            Updated{" "}
            {new Date(problem.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span className="text-xs">{submissionCount} Submissions</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          <span className="text-xs">95% Success Rate</span>
        </div>
      </div> */}

      {/* Main Content */}
      <ResizablePanelGroup
        direction="horizontal"
        className="mt-4 h-[calc(100vh-100px)] "
      >
        {/* Left Panel */}
        <ResizablePanel
          defaultSize={45}
          minSize={36}
          maxSize={70}
          className="h-screen flex-1 overflow-y-auto"
        >
          <div className="card bg-base-100 shadow-md h-full overflow-hidden flex flex-col p-2">
            <div className="tabs border-b px-4 pt-1 bg-gray-200 rounded-t-lg overflow-x-auto scrollbar-hide flex items-center gap-2">
              {["description", "submissions", "discussion", "hints"].map(
                (tab) => {
                  const Icon =
                    tab === "description"
                      ? FileText
                      : tab === "submissions"
                      ? Code2
                      : tab === "discussion"
                      ? MessageSquare
                      : Lightbulb;

                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      className={`tab px-3 py-1 flex items-center gap-1 text-xs transition-colors duration-150 whitespace-nowrap border-b-2 ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-base-content/60 hover:text-primary"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      <Icon className="w-3 h-3" />
                      {tab}
                    </button>
                  );
                }
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1 ">
              {renderTabContent()}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-base-300" />

        {/* Right Panel: Editor & Output */}
        <ResizablePanel>
          <ResizablePanelGroup
            direction="vertical"
            className="h-screen flex-1 overflow-y-auto"
          >
            {/* Editor */}
            <ResizablePanel defaultSize={65} minSize={15}>
              <div className="card bg-base-100 shadow-md h-full flex flex-col">
                <div className="tabs tabs-bordered px-4 pt-4 flex items-center justify-between">
                  <button className="tab tab-active gap-2">
                    <Terminal className="w-4 h-4" />
                    Code Editor
                  </button>
                  <select
                    className="select select-sm select-primary w-36"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    {Object.keys(problem.codeSnippets || {}).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="h-full w-full">
                    <Editor
                      height="100%"
                      language={selectedLanguage.toLowerCase()}
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-base-300" />

            {/* Output Panel */}
            <ResizablePanel>
              <div className="card bg-base-100 shadow-md h-full flex-1 overflow-y-auto">
                <div className="card-body p-4 flex flex-col gap-4">
                  {submission ? (
                    <Submission submission={submission} />
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <button
                          className={`btn btn-primary gap-2 ${
                            isExecuting ? "loading" : ""
                          }`}
                          onClick={handleRunCode}
                          disabled={isExecuting}
                        >
                          {!isExecuting && <Play className="w-4 h-4" />}
                          Run Code
                        </button>
                        <button className="btn btn-success gap-2">
                          Submit Solution
                        </button>
                      </div>
                      <div className="h-[200px] overflow-y-auto bg-base-200 rounded-md p-2 text-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          Test Cases
                        </h3>
                        <table className="table w-full table-zebra">
                          <thead>
                            <tr>
                              <th>Input</th>
                              <th>Expected Output</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testcases.map((testCase, index) => (
                              <tr
                                key={index}
                                className="hover:bg-base-300 transition-all"
                              >
                                <td className="font-mono whitespace-pre-wrap break-words max-w-[300px]">
                                  {testCase.input}
                                </td>
                                <td className="font-mono whitespace-pre-wrap break-words max-w-[300px]">
                                  {testCase.output}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProblemPage;
