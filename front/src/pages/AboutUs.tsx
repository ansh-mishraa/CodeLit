import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-16 flex flex-col items-center justify-center">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">About CodeLit</h1>
        <p className="text-lg text-zinc-300 mb-10">
          CodeLit is a coding platform built with passion, purpose, and perseverance — by a developer who truly understands what students and coders need.
        </p>

        <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-800 text-left">
          <h2 className="text-2xl font-semibold text-orange-400 mb-2">👋 Meet the Creator: Ansh Mishra</h2>
          <p className="text-zinc-300 leading-relaxed">
            I’m Ansh Mishra, a passionate developer and student of Information Technology, currently pursuing B.Tech at Oriental Institute of Science and Technology, Bhopal. I'm deeply involved in frontend development with strong knowledge of React, Tailwind CSS, TypeScript, and UI/UX fundamentals. 
          </p>
          <p className="text-zinc-300 mt-4 leading-relaxed">
            Alongside development, I’ve actively participated in coding competitions, workshops, and internships. From presenting ER diagrams to winning code sprints, I’ve always aimed to push my limits and build real-world, impactful projects.
          </p>
          <p className="text-zinc-300 mt-4 leading-relaxed">
            CodeLit is a result of my vision to simplify coding practice, host contests, and provide structured learning resources to students — all in one place. I wanted to build something that I, as a student, always wished existed.
          </p>

          <div className="mt-6 flex gap-4">
            <a href="mailto:anshmishraa.8708@gmail.com" className="text-zinc-400 hover:text-orange-400 transition">
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/Ansh-Mishra04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-orange-400 transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/ansh-mishraa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-orange-400 transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/ansh_mishraa04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-orange-400 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <p className="mt-12 text-sm text-zinc-500">
          © {new Date().getFullYear()} CodeLit — Made with ❤️ by Ansh Mishra
        </p>
      </div>
    </div>
  );
}
