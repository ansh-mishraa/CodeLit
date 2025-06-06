import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

// Define the Submission type (you can reuse or extend this)
interface Submission {
  id: string;
  sourceCode: string;
  problemId: string;
  output: string;
  createdAt: string;
  memoryUsed: string;
  timeTaken: string;
  languageId: number;
  status: string; // e.g., "success", "error"
  expectedOutputs: string[];
  stdin: string[];

  
  // Add more fields based on your backend response
}

// Define the execution store interface
interface ExecutionStore {
  isExecuting: boolean;
  submission: Submission | null;
  executeCode: (
    source_code: string,
    language_id: number,
    stdin: string[],
    expected_outputs: string[],
    problemId: string
  ) => Promise<void>;
}

// ✅ Create the store with proper types
export const useExecutionStore = create<ExecutionStore>((set) => ({
  isExecuting: false,
  submission: null,

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({ isExecuting: true });

      console.log(
        "Submission:",
        JSON.stringify({
          source_code,
          language_id,
          stdin,
          expected_outputs,
          problemId,
        })
      );
      console.log("check vvfnsdvjasj SDBHABHVBHBHFFFFFFFFFFFFFFFFFHSDBHBH", problemId);
      
      const res = await axiosInstance.post("/code-execution", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problem_id: problemId,
      });
      console.log("Response from code execution:", res.data);
      
      set({ submission: res.data.submission });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
