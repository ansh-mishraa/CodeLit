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
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

// Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(true);
  const { login, isLoggingIn } = useAuthStore();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      console.log("Login data", data);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex font-sans transition-colors duration-300 text-gray-800 dark:text-white bg-white dark:bg-[#121212]">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Sign in</h2>
            <p className="text-xs mb-6">
              Don’t have an account yet?{" "}
              <Link
                className="text-orange-400 hover:underline"
                to={"/register"}
              >
                Sign Up
              </Link>
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          className="bg-gray-100 dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="text-right text-xs text-blue-500 cursor-pointer hover:underline">
                  Forgot password?
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white p-3 rounded font-semibold"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </Button>
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                      try {
                        await login({
                          email: "user@gmail.com",
                          password: "user@123",
                        });
                        toast.success("Logged in as Guest User");
                      } catch (error) {
                        toast.error("Guest User login failed");
                      }
                    }}
                  >
                    Continue as Guest User
                  </Button>

                 
                </div>
              </form>
            </Form>

            {/* <div className="my-6 text-center relative">
              <hr className="w-full border-t border-gray-300 dark:border-gray-700 absolute top-1/2 transform -translate-y-1/2" />
              <span className="relative z-10 bg-white dark:bg-[#121212] px-2 text-gray-400">
                Or continue with
              </span>
            </div>

            <button className="w-full bg-white text-black flex items-center justify-center p-3 rounded shadow">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button> */}

            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              By signing in or creating an account, you agree to our{" "}
              <span className="underline">Terms & Conditions</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Right Side - Info Section */}
        <div className="hidden md:flex w-1/2 bg-gray-100 dark:bg-[#1c1c1c] flex-col justify-center p-12 space-y-10">
          <h1 className="text-4xl font-extrabold">Welcome to CodeLit</h1>

          <div className="space-y-6">
            {[
              {
                icon: "📊",
                title: "All in One Coding Profile",
                desc: "Showcase your complete coding portfolio and track all stats in one place.",
              },
              {
                icon: "📄",
                title: "Follow Popular Sheets",
                desc: "Organize notes and questions for seamless review.",
              },
              {
                icon: "🏆",
                title: "Contest Tracker",
                desc: "Track coding contest schedules and set reminders easily.",
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
