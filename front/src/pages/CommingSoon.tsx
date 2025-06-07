
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function CommingSoon() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4 overflow-hidden">
      {/* Background Glow Circles */}
      <div className="absolute top-16 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-2xl animate-pulse" />

      <motion.div
        className="z-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Trophy className="text-orange-400 w-16 h-16 animate-bounce drop-shadow-lg" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Contests Coming Soon
        </h1>
        <p className="text-lg text-zinc-300 mb-8">
          Our new <span className="text-orange-400 font-medium">coding contest</span> feature is under development.
          Compete. Win. Grow. Get ready to test your skills.
        </p>

        <button className="bg-orange-500 hover:bg-orange-400 transition px-6 py-3 rounded-md font-semibold shadow-lg hover:shadow-orange-400/50">
          Back to Home
        </button>

        <p className="mt-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} CodeLit. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
