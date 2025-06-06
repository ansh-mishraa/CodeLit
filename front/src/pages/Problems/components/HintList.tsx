import React from "react";

type ProblemHintsProps = {
  hints?: string[];
};

export default function ProblemHints({ hints }: ProblemHintsProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!hints || hints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto max-w-md bg-base-200 dark:bg-base-300 rounded-lg shadow-md text-center text-sm text-base-content/60 italic select-none">
        <div className="text-3xl mb-2">💡</div>
        <div>No hints available</div>
        <div className="mt-1 text-xs text-base-content/40">
          Try solving the problem to unlock hints!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-2">
      {hints.map((hint, i) => (
        <div
          key={i}
          className="border border-base-300 rounded-md bg-base-200 dark:bg-base-300"
        >
          <button
            className={`w-full flex justify-between items-center px-4 py-2 text-sm font-semibold text-base-content hover:bg-base-300 dark:hover:bg-base-400 rounded-md transition`}
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`hint-panel-${i}`}
          >
            <span>💡 Hint {i + 1}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openIndex === i && (
            <div
              id={`hint-panel-${i}`}
              className="px-4 py-3 text-sm text-base-content/80 border-t border-base-300 dark:border-base-600"
            >
              {hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
