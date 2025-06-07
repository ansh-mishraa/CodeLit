import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RocketIcon, CodeIcon } from 'lucide-react';

const Home = () => {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-[#f8fafc] via-blue-50 to-white dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          Welcome to <span className="text-orange-400">CodeLit</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
          Empower your coding journey with curated challenges, live contests, and a powerful learning ecosystem. Built for students, by students.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/problems">
            <Button className="h-10 px-6 bg-orange-400 hover:bg-orange-500 text-white text-sm">
              <CodeIcon className="w-4 h-4 mr-2" />
              Start Solving
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="h-10 px-6 border-orange-400 text-orange-400 hover:bg-orange-50 dark:hover:bg-[#1e1e1e] text-sm">
              <RocketIcon className="w-4 h-4 mr-2" />
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
