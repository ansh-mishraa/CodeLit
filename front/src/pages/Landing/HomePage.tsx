import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  RocketIcon,
  CodeIcon,
  Sparkles,
  Users,
  Flame,

  ArrowRight
} from 'lucide-react';

const Home = () => {
  return (
    <main className="bg-gradient-to-b from-[#f8fafc] via-blue-50 to-white dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-orange-400 opacity-20 rounded-full blur-[180px] z-0" />
        <div className="z-10 max-w-4xl mx-auto py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Ignite your coding journey with <span className="text-orange-400">CodeLit</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10">
            Practice. Compete. Excel. Built for students, by students — solve problems, join contests, and grow every day.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/problems">
              <Button className="h-11 px-8 bg-orange-400 hover:bg-orange-500 text-white text-base shadow-md rounded-xl">
                <CodeIcon className="w-5 h-5 mr-2" />
                Start Solving
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                className="h-11 px-8 border-orange-400 text-orange-400 hover:bg-orange-50 dark:hover:bg-[#1e1e1e] text-base rounded-xl"
              >
                <RocketIcon className="w-5 h-5 mr-2" />
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 text-center bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">Why You'll Love CodeLit</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-4" />,
              title: 'Curated Challenges',
              desc: 'Solve structured problem sets and level up from beginner to advanced.'
            },
            {
              icon: <Flame className="w-8 h-8 text-orange-400 mx-auto mb-4" />,
              title: 'Live Coding Contests',
              desc: 'Experience the heat of real-time coding competitions and improve under pressure.'
            },
            {
              icon: <Users className="w-8 h-8 text-orange-400 mx-auto mb-4" />,
              title: 'Student Community',
              desc: 'Learn alongside thousands of students. Share, compete and collaborate.'
            }
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="bg-orange-50 dark:bg-[#2a2a2a] p-8 rounded-2xl shadow-lg transition-transform hover:scale-[1.03]">
              {icon}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GET STARTED STEPS */}
      <section className="py-24 px-6 bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-[#191919] dark:via-[#1e1e1e] dark:to-[#121212] text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-16">Getting Started is Easy</h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Create Account',
              desc: 'Sign up using email or Google and unlock all features.'
            },
            {
              step: '02',
              title: 'Explore Problems',
              desc: 'Dive into curated DSA problems or try your hand at contests.'
            },
            {
              step: '03',
              title: 'Track & Improve',
              desc: 'Analyze your progress, revisit past attempts, and keep growing.'
            }
          ].map((step, i) => (
            <div key={i} className="bg-white dark:bg-[#1e1e1e] shadow-md rounded-2xl p-8 border border-orange-100 dark:border-gray-800">
              <div className="text-orange-400 font-bold text-3xl mb-2">{step.step}</div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 text-center bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-orange-50 dark:bg-[#2a2a2a] p-6 rounded-xl shadow-md">
            <p className="text-gray-700 dark:text-gray-300 italic text-lg">"CodeLit is the platform I wish I had in my 1st year. Super clean and powerful."</p>
            <p className="mt-3 font-semibold text-gray-800 dark:text-white">— Arjun D., Final Year CS</p>
          </div>
          <div className="bg-orange-50 dark:bg-[#2a2a2a] p-6 rounded-xl shadow-md">
            <p className="text-gray-700 dark:text-gray-300 italic text-lg">"I finally feel confident with DSA. Solving on CodeLit is fun and addictive."</p>
            <p className="mt-3 font-semibold text-gray-800 dark:text-white">— Riya S., 3rd Year IT</p>
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-orange-100 to-white dark:from-[#0d0d0d] dark:to-[#121212]">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">The future of coding starts here</h2>
        <p className="text-gray-700 dark:text-gray-400 mb-8 text-lg">Join thousands of students leveling up their coding game on CodeLit. It’s your turn.</p>
        <Link to="/register">
          <Button className="bg-orange-400 hover:bg-orange-500 text-white px-8 h-12 text-lg rounded-xl shadow-lg">
            <ArrowRight className="w-5 h-5 mr-2" />
            Join CodeLit Now
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default Home;
