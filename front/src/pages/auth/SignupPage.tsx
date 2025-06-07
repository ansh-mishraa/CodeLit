import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Header from "./components/Header";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

// Zod Schema for signup
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {signup, isSigninUp} = useAuthStore();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit=async(data: z.infer<typeof signupSchema>)=> {
    try {
      await signup(data);
      console.log("Signup",data);
      
    } catch (error) {
        console.log("Error signing up", error);
        toast.error("Error signing up");
        
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex font-sans transition-colors duration-300 text-gray-800 dark:text-white bg-white dark:bg-[#121212]">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-xs mb-6">
              Already have an account?{" "}
              <Link className="text-orange-400 hover:underline" to={"/login"}>
                Sign in
              </Link>
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                          <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold"
                  disabled={isSigninUp}
                >
                  {isSigninUp ?
                     (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing Up</>)
                     : "Sign Up"}
                </Button>
              </form>
            </Form>

            {/* <div className="my-6 text-center relative">
              <hr className="w-full border-t border-gray-300 dark:border-gray-700 absolute top-1/2 transform -translate-y-1/2" />
              <span className="relative z-10 bg-white dark:bg-[#121212] px-2 text-gray-400">
                Or continue with
              </span>
            </div> */}

            {/* <button className="w-full bg-white text-black flex items-center justify-center p-3 rounded shadow">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button> */}

            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <span className="underline">Terms & Conditions</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Right Side - Info Section */}
        <div className="hidden md:flex w-1/2 bg-gray-100 dark:bg-[#1c1c1c] flex-col justify-center p-12 space-y-10">
          <h1 className="text-4xl font-extrabold">Join CodeLit Today</h1>

          <div className="space-y-6">
            {[
              {
                icon: "👤",
                title: "Personalized Dashboard",
                desc: "Track your learning journey and manage your profile.",
              },
              {
                icon: "🧾",
                title: "Access Exclusive Sheets",
                desc: "Practice from industry-trusted DSA & interview prep sheets.",
              },
              {
                icon: "📆",
                title: "Contest Reminders",
                desc: "Never miss a coding contest again with timely alerts.",
              },
            ].map((item, i) => (
              <div className="flex items-start space-x-4" key={i}>
                <div className="text-orange-500 text-3xl">{item.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
