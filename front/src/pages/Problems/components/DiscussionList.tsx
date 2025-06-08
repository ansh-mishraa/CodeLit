import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

type Discussion = {
  name: string;
  message: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
};

const timeSince = (dateString: string) => {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count > 0) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const DiscussionList = ({
  discussions,
  isLoading,
  onPost,
}: {
  discussions: Discussion[];
  isLoading: boolean;
  onPost?: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handlePost = () => {
    if (!message.trim()) return;
    onPost?.(message.trim());
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Input Box */}
      {/* <div className="bg-base-200 border border-base-300 p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share something insightful..."
            className="input input-bordered input-sm w-full flex-1 text-sm focus:border-orange-500 focus:outline-none"
          />
          <button
            onClick={handlePost}
            className="relative inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-400 to-orange-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            🚀 Post
          </button>
        </div>
      </div> */}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center p-6">
          <span className="loading loading-spinner loading-md text-orange-500" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && discussions.length === 0 && (
        <div className="border border-dashed border-base-300 p-6 rounded-xl text-center text-sm text-base-content/70">
          💬 No discussions yet. Will add after exams😅!
        </div>
      )}

      {/* Discussion List */}
      <div className="space-y-4">
        {discussions.map((d) => (
          <div
            key={d.name}
            className="bg-base-100 border border-base-300 rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <div className="text-sm text-base-content/80 mb-1 flex items-center  justify-between">
            <div className="flex items-center gap-2 font-bold text-orange-200">
            {d.name} 
            </div>
            <div>
              {timeSince(d.createdAt)}
            </div>
            </div>
            <div className="text-sm text-base-content font-medium">
              {d.message}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-base-content/60 justify-end">
              <button className="flex items-center gap-1 hover:text-green-500 transition">
                <ThumbsUp className="w-4 h-4" />
                {d.upvotes}
              </button>
              <button className="flex items-center gap-1 hover:text-red-500 transition">
                <ThumbsDown className="w-4 h-4" />
                {d.downvotes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionList;
