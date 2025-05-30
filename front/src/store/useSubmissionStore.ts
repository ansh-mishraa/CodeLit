import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

// Define the Submission type
interface Submission {
  id: string;
  sourceCode: string;
  problemId: string;
  createdAt: string;
  // Add more fields as needed
}

// Define the store type
interface SubmissionStore {
  isLoading: boolean;
  submissions: Submission[];
  submission: Submission | null;
  submissionCount: number | null;
  getAllSubmissions: () => Promise<void>;
  getSubmissionForProblem: (problemId: string) => Promise<void>;
  getSubmissionCountForProblem: (problemId: string) => Promise<void>;
}

// ✅ Correct Zustand usage
export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");
      set({ submissions: res.data.submissions });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId: string) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );
      set({ submission: res.data.submissions[0] }); // or use the full array if needed
    } catch (error) {
      console.error("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId: string) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );
      set({ submissionCount: res.data.count });
    } catch (error) {
      console.error("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));
