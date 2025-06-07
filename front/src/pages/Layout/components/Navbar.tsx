import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "@/assets/dark.svg";
import { User, Code, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import LogoutButton from "@/components/logout-button";

// Dummy user

const Navbar = () => {
    const {authUser} = useAuthStore();
    console.log("Auth user",authUser);
    

  return (
    <header className="bg-white dark:bg-[#121212] shadow-md transition-colors fixed w-full z-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="logo" width={50} />
              <span className="text-lg font-bold text-[#f9962a] dark:text-[#f9962a] hover:text-orange-500">
                CodeLit
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition"
            >
              Home
            </Link>
            <Link
              to="/problems"
              className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition"
            >
              Problems
            </Link>
            <Link
              to="/contests"
              className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition"
            >
              Contests
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition"
            >
              About
            </Link>
           
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <ModeToggle />

            {/* Dummy User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className=" sm:flex items-center gap-2">
                  <img
                    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
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
                {authUser?.role === "ADMIN" && <Link to={"/add-problem"}>
                  <DropdownMenuItem>
                    <Code className="mr-2 h-4 w-4" />
                    Add Prolem
                  </DropdownMenuItem>
                </Link>}
                <Link to={"/"}>
                <DropdownMenuItem>
                <LogoutButton className='flex flex-row'>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </LogoutButton>
                </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Icon */}
            {/* <div className="block md:hidden">
              <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
