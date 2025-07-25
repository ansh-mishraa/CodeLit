import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

type ActionState = {
    isDeletingProblem: boolean;
    onDeleteProblem: (id: any) => Promise<void>;
}   

export const useActions = create<ActionState>((set)=>({
    isDeletingProblem:false,

    onDeleteProblem:async(id:any)=>{
        try {
             set({ isDeletingProblem: true });
            const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
            toast.success(res.data.message);
        } catch (error) {
             console.log("Error deleting problem", error);
            toast.error("Error deleting problem");
        }
        finally{
            set({isDeletingProblem:false})
        }
    }
}))