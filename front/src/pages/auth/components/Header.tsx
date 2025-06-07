import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import logo from '@/assets/dark.svg';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white dark:bg-[#121212] shadow-md transition-colors fixed w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
            <Link to={"/"}>
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="logo" width={50} />
            <span className="text-lg font-bold text-[#f9962a] dark:text-[#f9962a] hover:text-orange-500">CodeLit</span>
          </div>
            </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <Link to="/" className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition">
              Home
            </Link>
            <Link to="problems" className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition">
              Problems
            </Link>
            <Link to="/contests" className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition">
              Contests
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition">
              Contact Us
            </Link>
            
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Login & Register */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Mode Toggle */}
            <ModeToggle />
              <Link
                to="/login"
              >
                <Button className='h-8 bg-orange-400 hover:bg-orange-500'>
                Login
                </Button>
              </Link>
              <Link
                to="/register"
              >
               <Button 
                className="h-8 bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition text-xs"
               >
                Register
                </Button>
              </Link>
            </div>

            

            {/* Mobile menu icon */}
            <div className="block md:hidden">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
