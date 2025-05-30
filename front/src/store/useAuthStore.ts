import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

type AuthState = {
  authUser: any | null; 
  isSigninUp: boolean;
  isLoggingIn: boolean,
  isCheckingAuth:boolean
  checkAuth:any,
  signup:any,
  login:any,
  logout:any,
  verifyEmail:any,
  
};
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,


  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/get-profile");
      console.log("checkauth response", res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data:any) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data:any) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },

  verifyEmail: async (token:any) => {
  try {
    const response = await axiosInstance.get(`/auth/verify/${token}`);

    // If your backend sends back updated user info
    const updatedUser = response.data?.user;
    if (updatedUser) {
      set({ authUser: updatedUser });
    }

    toast.success("Email verified successfully!");
  } catch (error:any) {
    console.error("Error verifying email:", error);
    toast.error(error.response?.data?.message || "Failed to verify email.");
  }
},

}));