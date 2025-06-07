import React from "react";

type Problem = {
  title: string;
  timestamp: string;
};

type ProblemCardListProps = {
  problems: Problem[];
};

const ProblemCardList: React.FC<ProblemCardListProps> = ({ problems }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-full mx-auto">
      {problems.map((problem, index) => (
        <div
          key={index}
          className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 rounded-md px-4 py-3 flex justify-between items-center shadow hover:shadow-orange-400/20"
        >
          <span className="text-white font-medium">{problem.title}</span>
          <span className="text-gray-400 text-sm whitespace-nowrap">
            {problem.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProblemCardList;
