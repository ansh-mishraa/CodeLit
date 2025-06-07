import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import EmailVerify from "./pages/auth/EmailVerify";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/Landing/HomePage";
import { useEffect } from "react";
import {  Loader2 } from "lucide-react";
import logo from "@/assets/dark.svg";
import Layout from "./pages/Layout/Layout";
import Problems from "./pages/Problems/Problems";
import Contests from "./pages/Contests/Contests";
import CommingSoon from "./pages/CommingSoon";
import Profile from "./pages/Profile/Profile";
import AddProblem from "./pages/Problems/AddProblem";
import ProblemPage from "./pages/Problems/ProblemPage";
import AboutUs from "./pages/AboutUs";

// Helper Component for Protected Routes
const ProtectedRoute = ({ element, authUser, redirectTo = "/login" }: any) => {
  return authUser ? element : <Navigate to={redirectTo} />;
};

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img className="animate-pulse" src={logo} width={90} />
        <div className="mt-3 text-2xl animate-pulse text-orange-300 font-bold">
          CodeLit
        </div>
        <Loader2 className="animate-spin mt-4 text-2xl text-orange-300" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Landing */}
            <Route
              index
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/problems"
              element={<ProtectedRoute element={<Problems />} authUser={authUser} />}
            />
            <Route
              path="/contests"
              element={<ProtectedRoute element={<CommingSoon />} authUser={authUser} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} authUser={authUser} />}
            />
            <Route
            path="/about"
            element={<ProtectedRoute element={<AboutUs />} authUser={authUser} />}
          />
            {authUser?.role === "ADMIN" && (
              <Route
                path="/add-problem"
                element={<ProtectedRoute element={<AddProblem />} authUser={authUser} />}
              />
              
            )}
          </Route>
          {/* Auth */}
          <Route
            path="/problem/:id"
            element={authUser ? <ProblemPage /> : <LoginPage />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <HomePage />}
          />
          <Route
            path="/register"
            element={!authUser ? <SignupPage /> : <HomePage />}
          />
          <Route
            path="/verify-email"
            element={!authUser ? <EmailVerify /> : <HomePage />}
          />
          
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
