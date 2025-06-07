import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
type ProblemState = {
  problems: any[];
  problem: any;
  solvedProblems: any[];
  isProblemsLoading: boolean;
  isProblemLoading: boolean;
  solvedBY: any[];
  userName: any;

  getAllProblems: () => Promise<void>;
  getProblemById: (id: any) => Promise<void>;
  getSolvedProblemByUser: () => Promise<void>;
  getAllSolvedByUser: () => Promise<void>;
  getUserNameById: (id: any) => Promise<void>;
};
export const useProblemStore = create<ProblemState>((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  solvedBY: [],
  userName: null,
  

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-problems");
      console.log(res);
      

      set({ problems: res.data.data });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
      
    }
  },

  getProblemById: async (id:any) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
        console.log(res.data);
        
      set({ problem: res.data.data });
    
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      console.log(res.data.data);
      
      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },

  getAllSolvedByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/all-solvedby");
      console.log(res.data.data);
      
      set({ solvedBY: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
  getUserNameById: async (id:any) => {
    try {
      const res = await axiosInstance.get(`/problems/user-name/${id}`);
      console.log(res.data.data);
      
      set({ userName: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
  
}));
