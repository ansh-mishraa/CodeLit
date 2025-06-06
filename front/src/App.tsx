import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import EmailVerify from "./pages/auth/EmailVerify";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/Landing/HomePage";
import { useEffect } from "react";
import { Loader, Loader2 } from "lucide-react";
import logo from "@/assets/dark.svg";
import Layout from "./pages/Layout/Layout";
import Problems from "./pages/Problems/Problems";
import Contests from "./pages/Contests/Contests";
import Profile from "./pages/Profile/Profile";
import AddProblem from "./pages/Problems/AddProblem";
import UpdateProblemForm from "./pages/Problems/components/UpdateProblemForm";
import CreateProblemForm from "./pages/Problems/components/CreateProblemForm";
import ProblemPage from "./pages/Problems/ProblemPage";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
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
  console.log(authUser);

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
              element={authUser ? <Problems /> : <Navigate to="/login" />}
            />
            <Route
              path="/contests"
              element={authUser ? <Contests /> : <Navigate to="/login" />}
            />
            {/* <Route path="/about" element={<div>About</div>} />
            <Route path="/contact" element={<div>Contact</div>} /> */}
            <Route
              path="/profile"
              element={authUser ? <Profile /> : <Navigate to="/login" />}
            />
            {authUser?.role === "ADMIN" && (
              <Route
                path="/add-problem"
                element={authUser ? <AddProblem /> : <Navigate to="/login" />}
              />
            )}
            
           
          </Route>
          {/* Auth */}

 <Route
              path="/problem/:id"
              element={authUser ? <ProblemPage /> : <Navigate to="/login" />}
            />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/verify-email"
            element={!authUser ? <SignupPage /> : <EmailVerify />}
          />

         
          {/* <Route path="/forgot-password" element={}/> */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
