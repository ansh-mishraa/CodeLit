import { Link } from 'react-router-dom';
import { Github, Mail, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-[#0d0d0d] overflow-hidden">
      {/* Watermark Text */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <h1 className="text-[6rem] md:text-[10rem] font-extrabold text-orange-500 opacity-10 select-none z-0 leading-none">
          CodeLit
        </h1>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 border-t border-orange-100 dark:border-orange-900 backdrop-blur-md bg-white/70 dark:bg-[#121212]/60 rounded-t-3xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* Column 1 - Branding */}
          <div>
            <Link to="/" className="text-3xl font-extrabold text-orange-400 tracking-wide">
              CodeLit
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              The ultimate coding platform for students & developers.  
              Practice. Compete. Grow.
            </p>
          </div>

          {/* Column 2 - Site Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Explore</h3>
            <div className="flex flex-col space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/problems" className="hover:text-orange-400 transition">Problems</Link>
              <Link to="/contests" className="hover:text-orange-400 transition">Contests</Link>
              <Link to="/about" className="hover:text-orange-400 transition">About</Link>
              <Link to="/contact" className="hover:text-orange-400 transition">Contact</Link>
            </div>
          </div>

          {/* Column 3 - Community + Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Community</h3>
            <div className="flex flex-col space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">GitHub</a>
              <a href="mailto:support@codelit.dev" className="hover:text-orange-400 transition">Support</a>
              <a href="#" className="hover:text-orange-400 transition">Terms & Conditions</a>
              <a href="#" className="hover:text-orange-400 transition">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center mt-10 space-x-6 text-gray-600 dark:text-gray-400">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
            <Github />
          </a>
          <a href="mailto:support@codelit.dev" className="hover:text-orange-400 transition">
            <Mail />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
            <Linkedin />
          </a>
        </div>

        {/* Bottom Line */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} CodeLit. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
