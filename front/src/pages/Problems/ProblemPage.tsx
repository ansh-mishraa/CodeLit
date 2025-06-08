import  { useState, useEffect } from "react";
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
  
  ChevronRight,
  
  Terminal,
  Code2,
  Home,
  Loader2,
  Tags,
  School,
  User,
  Code,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "@/store/useProblemStore";
import { getLanguageId } from "@/lib/lang";
import { useExecutionStore } from "@/store/useExecutionStore";
import { useSubmissionStore } from "@/store/useSubmissionStore";

import SubmissionsList from "./components/SubmissionList";
import { ModeToggle } from "@/components/mode-toggle";
import DiscussionList from "./components/DiscussionList";
import ProblemHints from "./components/HintList";
import { toast } from "sonner";
import ProblemMetaAccordion from "./components/TagList";
import LogoutButton from "@/components/logout-button";
import { useAuthStore } from "@/store/useAuthStore";

const ProblemPage = () => {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    
  } = useSubmissionStore();
  const [activeMainTab, setActiveMainTab] = useState("testcases");
  const [activeCaseTab, setActiveCaseTab] = useState(0);
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

  const handleRunCode = async (e: any) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage) as number;
      const stdin = problem.testCases.map((tc: any) => tc.input);
      const expected_outputs = problem.testCases.map((tc: any) => tc.output);
      console.log(id, "id");

      await executeCode(code, language_id, stdin, expected_outputs, id as any);
      setActiveMainTab("results");
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
  console.log(problem.difficulty, "problem.difficulty");

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none text-sm md:text-base text-base-content">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                style={{
                  backgroundColor:
                    problem?.difficulty == "EASY"
                      ? "green"
                      : problem.difficulty == "MEDIUM"
                      ? "yellow"
                      : problem.difficulty == "HARD"
                      ? "red"
                      : "gray",
                  color: "white", // Ensures text stays white
                }}
              >
                {problem.difficulty}
              </Badge>

              <Badge variant="outline">
                <Tags />
                Tags
              </Badge>
              <Badge variant="outline">
                <School /> Company
              </Badge>
            </div>
            {/* Problem Description */}
            <p className="text-sm md:text-sm mb-6">{problem.description}</p>

            {/* Examples */}
            {problem.examples && (
              <>
                <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-4">
                  Examples
                </h3>

                {Object.entries(problem.examples).map(
                  ([lang, example], _) => {
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
            <ProblemHints hints={["Hint 1", "Hint 2"]} />
            <ProblemMetaAccordion
              tags={problem.tags.map(
                (tag: any) => tag.charAt(0).toUpperCase() + tag.slice(1)
              )}
              companies={["Amazon", "Google", "Adobe"]}
            />
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
  const memoryArr = JSON.parse(submission?.memoryUsed || "[]");
  const timeArr = JSON.parse(submission?.timeTaken || "[]");
  console.log(submission);

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m: any) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a: any, b: any) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t: any) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a: any, b: any) => a + b, 0) / timeArr.length;
  console.log("avgMemory", avgMemory, "avgTime", avgTime, timeArr);

  const testCaseResults = (submission as any)?.testCaseResults;

  return (
    <div className="max-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full p-0">
      {/* Navigation Bar */}
      <nav className="bg-base-100 shadow top-0 z-50 w-full sticky border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center gap-4 text-primary w-full max-w-[75%]">
            <Link to="/" className="flex items-center gap-2 hover:underline">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
            </Link>
            <h1 className="text-lg md:text-lg font-semibold truncate">
              {problem.title}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <button
              className={`btn btn-ghost btn-circle ${
                isBookmarked ? "text-primary" : ""
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="btn btn-ghost btn-circle" aria-label="Share"
              onClick={() => navigator.clipboard.writeText(window.location.href)
                .then(() => {
                  toast.success("Link copied to clipboard!");
                })
                .catch(() => {
                  toast.error("Failed to copy link to clipboard.");
                })
              }
            >
              <Share2 className="w-5 h-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className=" sm:flex items-center gap-2">
                  <img
                    src={
                      authUser?.image ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-orange-400"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3 mt-3">
                <DropdownMenuLabel>Hi, {authUser?.name}! 👋</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={"/profile"}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                {authUser?.role === "ADMIN" && (
                  <Link to={"/add-problem"}>
                    <DropdownMenuItem>
                      <Code className="mr-2 h-4 w-4" />
                      Add Prolem
                    </DropdownMenuItem>
                  </Link>
                )}
                <Link to={"/"}>
                  <DropdownMenuItem>
                    <LogoutButton className="flex flex-row">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </LogoutButton>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className="flex flex-col mt-4"
        style={{ height: "calc(100vh - 4rem)" }} // Adjust the height here based on your navbar height
      >
        <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
          {/* Left Panel */}
          <ResizablePanel
            defaultSize={45}
            minSize={36}
            maxSize={70}
            className="h-full flex-1 overflow-y-auto"
          >
            <div className="card bg-base-100 shadow-md h-full overflow-hidden flex flex-col p-2">
              <div className="tabs border-b px-4 pt-1 bg-gray-200 dark:bg-gray-600 rounded-t-lg overflow-x-auto scrollbar-hide flex items-center gap-2">
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
              <div className="p-6 overflow-y-auto flex-1">
                {renderTabContent()}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-base-300" />

          {/* Right Panel: Editor & Output */}
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical" className="h-full flex-1">
              {/* Editor */}
              <ResizablePanel defaultSize={65} minSize={15}>
                <div className="card bg-base-100 shadow-md h-full flex flex-col m-2">
                  <div className="tabs tabs-bordered px-4 py-2 flex items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                    {/* Code Editor Tab */}
                    <button className="tab tab-active gap-2 flex items-center text-xs font-medium transition-all duration-200">
                      <Terminal className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      <span className="text-xs">Code Editor</span>
                    </button>

                    {/* Language Selector */}
                    <select
                      className="select select-xs select-primary w-auto text-xs border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-600 dark:text-gray-200 transition-all duration-200"
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
              <ResizablePanel defaultSize={45} minSize={18} maxSize={70}>
                <div className="card bg-base-300 shadow-lg h-full flex-1 overflow-y-auto rounded-lg">
                  <div className="card-body px-4 py-2 flex flex-col gap-2">
                    {/* Top Buttons */}
                    <div className="flex justify-between items-center border-b border-base-100 pb-1 text-sm">
                      {/* Main Tabs (Testcase / Results) */}
                      <div className="flex items-center gap-4">
                        {["testcases", "results"].map((tab) => (
                          <button
                            key={tab}
                            className={`capitalize pb-2 transition-all duration-200 border-b-2 ${
                              activeMainTab === tab
                                ? "border-orange-300 text-success font-semibold text-orange-400 dark:text-orange-400"
                                : "border-transparent text-base-content/70 hover:text-base-content"
                            }`}
                            onClick={() => {
                              setActiveMainTab(tab);
                              setActiveCaseTab(0); // Reset case tab when switching main tabs
                            }}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Right Section (Run Code & Submit Solution Buttons) */}
                      <div className="flex items-center gap-4">
                        {/* Run Code Button */}
                        <button
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-all ease-in-out duration-300 cursor-pointer
                        ${
                          isExecuting
                            ? "bg-blue-600 cursor-wait"
                            : "hover:bg-orange-500 dark:bg-orange-400 disabled:bg-blue-300 bg-orange-400 dark:hover:bg-orange-500"
                        }`}
                          onClick={handleRunCode}
                          disabled={isExecuting}
                        >
                          {isExecuting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          <span className="text-xs">
                            {isExecuting ? "Running..." : "Run"}
                          </span>
                        </button>

                        {/* Submit Solution Button */}
                        <button
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-all ease-in-out duration-300
                       hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-gray-400 bg-green-500 dark:disabled:bg-gray-600 cursor-pointer"
                          onClick={() => {
                            if (!submission) {
                              toast.error(
                                "Please run the code first to submit."
                              );
                              return;
                            }
                            // Handle submission logic here
                            toast.success("Solution submitted successfully!");
                          }}
                        >
                          <Code2 className="w-3 h-3" />
                          <span className="text-xs">
                            {isExecuting ? "Running..." : "Submit"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Testcase View */}
                    {activeMainTab === "testcases" && testcases?.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {/* Case Tabs */}
                        <div className="flex gap-2 text-xs font-mono">
                          {testcases.map((_: any, index: any) => (
                            <button
                              key={index}
                              className={`px-3 py-1 rounded-md border text-sm transition-all duration-200
                                  ${
                                    activeCaseTab === index
                                      ? "dark:bg-white bg-gray-500 text-black border-white hover:bg-gray-300"
                                      : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-[#2e2e2e] dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                                  } 
                                `}
                              onClick={() => setActiveCaseTab(index)}
                            >
                              • Case {index + 1}
                            </button>
                          ))}
                        </div>

                        {/* Case Content */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 space-y-5 border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-800 dark:text-gray-300">
                          {/* Input */}
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">
                              Input
                            </p>
                            <div className="bg-gray-100 dark:bg-[#2e2e2e] p-3 rounded-md border border-gray-300 dark:border-gray-700 whitespace-pre-wrap">
                              {testcases[activeCaseTab]?.input}
                            </div>
                          </div>

                          {/* Expected Output */}
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">
                              Expected
                            </p>
                            <div className="bg-gray-100 dark:bg-[#2e2e2e] p-3 rounded-md border border-gray-300 dark:border-gray-700 whitespace-pre-wrap">
                              {testcases[activeCaseTab]?.output}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Results View */}
                    {activeMainTab === "results" && (
                      <div className="flex flex-col gap-4">
                        {/* No Submission Message */}
                        {!submission ? (
                          <p className="text-xs text-muted-foreground">
                            No submission available yet.
                          </p>
                        ) : (
                          <>
                            {/* Submission Result Summary */}
                            <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-md text-sm flex justify-between items-center border border-gray-200 dark:border-gray-700">
                              {/* Status (Left) */}
                              <div className="flex items-center gap-2 font-mono">
                                {submission.status === "Accepted" ? (
                                  <p className="text-green-600 dark:text-green-500 font-semibold">
                                    Accepted
                                  </p>
                                ) : (
                                  <p className="text-red-600 dark:text-red-500 font-semibold">
                                    Wrong Answer
                                  </p>
                                )}
                              </div>

                              {/* Runtime & Memory (Right) */}
                              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                                <span>• Runtime: {avgTime.toFixed(2)} ms</span>
                                <span>• Memory: {avgMemory.toFixed(0)} MB</span>
                              </div>
                            </div>

                            {/* Case Tabs */}
                            <div className="flex gap-2 text-xs font-mono">
                              {testCaseResults.map(
                                (result: any, index: any) => (
                                  <button
                                    key={index}
                                    className={`px-3 py-1 rounded-md border text-sm transition-all duration-200
                                    ${
                                      activeCaseTab === index
                                        ? "dark:bg-white bg-gray-500 text-white border-white hover:bg-gray-300"
                                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-[#2e2e2e] dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                                    } 
                                    ${
                                      result.passed
                                        ? "text-green-500 dark:text-green-500"
                                        : "text-red-500 dark:text-red-500"
                                    }`}
                                    onClick={() => setActiveCaseTab(index)}
                                  >
                                    • Case {index + 1}
                                  </button>
                                )
                              )}
                            </div>

                            {/* Case Details */}
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 space-y-5 border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-800 dark:text-gray-300">
                              {/* Input */}
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Input
                                </p>
                                <div className="bg-gray-100 dark:bg-[#2e2e2e] p-3 rounded-md border border-gray-300 dark:border-gray-700 whitespace-pre-wrap">
                                  {testcases[activeCaseTab]?.input}
                                </div>
                              </div>

                              {/* Output */}
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Output
                                </p>
                                <div
                                  className={`bg-gray-100 dark:bg-[#2e2e2e] p-3 rounded-md border text-sm whitespace-pre-wrap
    ${
      testCaseResults[activeCaseTab]?.passed
        ? "text-green-600 dark:text-green-500 border-green-300 dark:border-green-700"
        : "text-red-600 dark:text-red-500 border-red-300 dark:border-red-700"
    }`}
                                >
                                  {testCaseResults[activeCaseTab]?.stdOut}
                                </div>
                              </div>

                              {/* Expected Output */}
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Expected
                                </p>
                                <div className="bg-gray-100 dark:bg-[#2e2e2e] p-3 rounded-md border border-gray-300 dark:border-gray-700 text-green-600 dark:text-green-400 whitespace-pre-wrap">
                                  {
                                    testCaseResults[activeCaseTab]
                                      ?.expectedOutput
                                  }
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemPage;
