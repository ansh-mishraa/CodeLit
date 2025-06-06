import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const SubmissionsList = ({
  submissions,
  isLoading,
}: {
  submissions: any;
  isLoading: boolean;
}) => {
  const safeParse = (data: string) => {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const calculateAverageMemory = (memoryData: string) => {
    const memoryArray = safeParse(memoryData).map((m: any) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((a: number, b: number) => a + b, 0) /
      memoryArray.length
    );
  };

  const calculateAverageTime = (timeData: string) => {
    const timeArray = safeParse(timeData).map((t: any) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return (
      timeArray.reduce((a: number, b: number) => a + b, 0) / timeArray.length
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <span className="loading loading-spinner loading-md text-orange-500" />
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center p-6 flex flex-col items-center justify-center gap-2">
        <div className="text-2xl">📭</div>
        <div className="text-sm text-base-content/80 font-medium">
          No submissions yet
        </div>
        <div className="text-xs text-base-content/60">
          Solve a problem to see your submissions here.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission: any) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <div
            key={submission.id}
            className="bg-base-200/80 border border-base-300 dark:border-zinc-700 rounded-xl px-4 py-3 transition-all hover:shadow-md hover:border-orange-500"
          >
            <div className="flex justify-between items-center flex-wrap gap-3">
              {/* Left: Status and Language */}
              <div className="flex items-center gap-3">
                {submission.status === "Accepted" ? (
                  <div className="flex items-center gap-1 text-green-500 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accepted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500 font-medium text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>{submission.status}</span>
                  </div>
                )}
                <div className=" justify-end bg-base-100/70 px-2 py-0.5 rounded-full text-xs font-medium border border-base-300">
                  {submission.language}
                </div>
              </div>
              <br />
              {/* Right: Metrics */}
              <div className="flex gap-5 text-xs text-base-content/70 items-center">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{avgTime.toFixed(3)} s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Memory className="w-3.5 h-3.5" />
                  <span>{avgMemory.toFixed(0)} KB</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(submission.createdAt).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
