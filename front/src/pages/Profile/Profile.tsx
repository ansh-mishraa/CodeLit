import  {  useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy,  Flame,  } from "lucide-react";

import Pie from "./components/PieChart";
import ActivityHeatmapCard from "./components/HeatMap";
import ProblemCardList from "./components/SolvedProblem";
import { useProblemStore } from "@/store/useProblemStore";



const currentUser = { name: "Ansh Mishra", score: 107, rank: 21_764 };

export default function Profile() {
  const normalizeDateFormat = (data: any[]) => {
    return data.map((entry) => {
      const date = new Date(entry.date);
      const normalizedDate = date.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
      return { ...entry, date: normalizedDate };
    });
  };
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [litCoin, setLitCoin] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  // Normalize the data before passing it to ActivityHeatmapCard
  const {
    getSolvedProblemByUser,
    solvedProblems,
    getAllSolvedByUser,
    solvedBY,
    getUserNameById,
  } = useProblemStore();
  const [heatData, setHeatData] = useState([]);
  const normalizedData = normalizeDateFormat(heatData);
  const [solvedUserList, setSolvedUserList] = useState({});
  const [leaderboardData, setLeaderboardData] = useState<
  { name: string; score: number; rank: number }[]
>([]);

  useEffect(() => {
    // Only fetch data if solvedProblems is empty or undefined
    if (solvedProblems.length === 0) {
      getSolvedProblemByUser().finally(() => {
      });
    }

    console.log("Problems", solvedProblems);

    // Initialize counts for easy, medium, and hard problems
    let easy = 0;
    let medium = 0;
    let hard = 0;

    // Loop through the problems and count based on difficulty
    solvedProblems.forEach((problem) => {
      console.log("loop initiated");
      if (problem.difficulty === "EASY") {
        easy += 1;
      } else if (problem.difficulty === "MEDIUM") {
        medium += 1;
      } else if (problem.difficulty === "HARD") {
        hard += 1;
      }
    });

    // Set the counts to state
    setEasyCount(easy);
    setMediumCount(medium);
    setHardCount(hard);
    setLitCoin(easy * 1 + medium * 3 + hard * 5);
  }, [solvedProblems]); // The effect will now only run when `solvedProblems` changes.

  console.log(easyCount, mediumCount, hardCount, solvedProblems);

  function groupByDate(problems: any) {
    const result = problems.reduce((acc: any, problem: any) => {
      const submissionDate = problem.updatedAt;

      if (!submissionDate) {
        console.warn(`Missing submissionDate for problem: ${problem.title}`);
        return acc;
      }

      const date = new Date(submissionDate);

      if (isNaN(date.getTime())) {
        console.warn(`Invalid date: ${submissionDate}`);
        return acc; // Skip this entry if the date is invalid
      }

      // Convert the submissionDate to 'YYYY-MM-DD' format
      const dateString = date.toISOString().split("T")[0];

      // Find the existing entry for this date
      const existingDateEntry = acc.find(
        (entry: any) => entry.date === dateString
      );

      if (existingDateEntry) {
        // If entry exists, increment the count
        existingDateEntry.count += 1;
      } else {
        // If entry doesn't exist, add a new entry with count 1
        acc.push({ date: dateString, count: 1 });
      }

      return acc;
    }, []);

    return result;
  }

  console.log(groupByDate(solvedProblems));

  useEffect(() => {
    const groupedData = groupByDate(solvedProblems);
    setHeatData(groupedData);
  }, [solvedProblems]);
  console.log(heatData);

  useEffect(() => {
    // Only fetch data if solvedBY is empty or undefined
    if (solvedBY.length === 0) {
      getAllSolvedByUser().finally(() => {
      });
    }
  }, []);

  console.log(solvedBY, "Solved by");

  // Function to calculate the difficulty count per user
  async function getUserSolvedCountsByDifficulty(problems: any[]) {
    const result: Record<
      string,
      {
        name: string;
        EASY: number;
        MEDIUM: number;
        HARD: number;
        Total: number;
      }
    > = {};

    for (const problem of problems) {
      const difficulty = problem.difficulty;

      for (const user of problem.solvedBy) {
        const userId = user.userId;

        if (!result[userId]) {
          await getUserNameById(userId); // sets global variable
          const currentName = useProblemStore.getState().userName; // read after await
          result[userId] = {
            name: currentName.name,
            EASY: 0,
            MEDIUM: 0,
            HARD: 0,
            Total: 0,
          };
        }

        if (difficulty === "EASY") {
          result[userId].EASY++;
        } else if (difficulty === "MEDIUM") {
          result[userId].MEDIUM++;
        } else if (difficulty === "HARD") {
          result[userId].HARD++;
        }
        result[userId].Total++;
      }
    }

    return result;
  }

  useEffect(() => {
    async function fetchData() {
      const counts = await getUserSolvedCountsByDifficulty(solvedBY);
      setSolvedUserList(counts);
    }

    if (solvedBY.length > 0) {
      fetchData();
    }
  }, [solvedBY]);

  console.log(solvedUserList);
useEffect(() => {
  if (!solvedUserList) return;

  const leaderboardArray = Object.entries(solvedUserList)
    .map(([_, data] : [string, any]) => ({
      name: data.name,
      score: data.EASY + data.MEDIUM + data.HARD,
    }))
    .sort((a, b) => b.score - a.score) // Sort descending
    .slice(0, 10) // Take top 10
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

  setLeaderboardData(leaderboardArray);
}, [solvedUserList]);
console.log(leaderboardData);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-orange-500/40 transition-shadow duration-300">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="bg-orange-400 w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold">
                A
              </div>
              <h2 className="text-xl font-semibold mt-4">Ansh Mishra</h2>
              <p className="text-sm text-zinc-400">@ansh.codes</p>
              <Button
                variant="default"
                className="mt-6 w-full text-orange-400 bg-zinc-800 hover:bg-orange-500 hover:text-white transition duration-200"
              >
                Share Codelit Card
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard Card */}
          <Card className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 shadow-xl hover:shadow-orange-500/30 transition-shadow duration-300 ">
            <CardContent className="p-4">
              <h3 className="text-lg text-orange-400 font-semibold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20} /> Leaderboard
              </h3>

              <div className="max-h-120 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 rounded-lg">
                <ul className="space-y-2 text-sm">
                  {leaderboardData.map((user) => (
                    <li
                      key={user.rank}
                      className={`flex justify-between items-center p-2 rounded-lg transition duration-200 hover:bg-zinc-800 ${
                        user.name === currentUser.name
                          ? "bg-orange-500/20"
                          : "bg-zinc-900"
                      }`}
                    >
                      <span className="font-bold text-zinc-400">
                        #{user.rank}
                      </span>
                      <span className="text-white font-medium">
                        {user.name}
                      </span>
                      <span className="text-orange-400 font-semibold">
                        {user.score}
                      </span>
                    </li>
                  ))}

                  {!leaderboardData.find(
                    (u) => u.name === currentUser.name
                  ) && (
                    <li className="flex justify-between items-center p-2 rounded-lg bg-orange-500/20">
                      <span className="font-bold text-zinc-400">
                        #{currentUser.rank}
                      </span>
                      <span className="text-white font-medium">
                        {currentUser.name}
                      </span>
                      <span className="text-orange-400 font-semibold">
                        {currentUser.score}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="col-span-1 md:col-span-3 space-y-6">
          {/* Cards in Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pie Chart Card */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-green-400/30 transition-shadow duration-300 h-64 overflow-hidden">
              <CardContent className="">
                <h3 className="text-lg text-zinc-400 flex justify-center">
                  Total Solved
                </h3>

                {/* Pie Chart */}
                <div className="flex justify-center items-center">
                  <Pie pieData={[easyCount, mediumCount, hardCount]} />
                </div>

                {/* Difficulty row */}
                <div className="flex justify-between items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <span className="text-green-400 text-sm">Easy</span>
                    <span className="font-bold text-xs">55</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-yellow-400 text-sm">Medium</span>
                    <span className="font-bold text-xs">36</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-red-400 text-sm">Hard</span>
                    <span className="font-bold text-xs">16</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Solved Card */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-orange-500/30 transition-shadow duration-300 h-64">
              <CardContent className="flex flex-col items-center justify-center ">
                {/* Trophy Icon and Ranking */}
                <div className="flex items-center space-x-2 ">
                  <Trophy className="text-yellow-500 w-10 h-10" />{" "}
                  {/* Gold Trophy Icon */}
                </div>
                <p className="text-lg text-zinc-400 mb-4">Ranking</p>

                {/* Rank Number with Slash and Total Users */}
                <p className="text-5xl font-bold text-white mt-2">
                  {litCoin}
                  <span className="text-sm text-zinc-500">/{40}</span>
                </p>

                {/* Description or Info */}
                <p className="text-sm text-zinc-500 mt-10">
                  Based on solved problems
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-orange-400/20 transition-shadow duration-300 col-span-2 h-64">
              <CardContent>
                {/* Card Title */}
                <h3 className="text-xl text-zinc-400 mb-6 font-semibold tracking-wide flex justify-center">
                  Don't Let Your Fire Down
                </h3>

                {/* Streak Data Container */}
                <div className="flex justify-between items-center mb-6">
                  {/* Max Streak */}
                  <div className="text-center bg-zinc-800 p-6 rounded-xl w-32">
                    <Flame className="text-orange-500 mx-auto mb-2 text-4xl" />
                    <p className="text-sm text-zinc-500">Max</p>
                    <p className="font-extrabold text-3xl text-white">14</p>
                  </div>

                  {/* Current Streak */}
                  <div className="text-center bg-zinc-800 p-6 rounded-xl w-32">
                    <Flame className="text-zinc-500 mx-auto mb-2 text-4xl" />
                    <p className="text-sm text-zinc-500">Current</p>
                    <p className="font-extrabold text-3xl text-white">0</p>
                  </div>
                </div>

                {/* Card Footer (Optional) */}
                <div className="flex justify-center mt-4">
                  <p className="text-sm text-zinc-500">
                    Keep Going! Your streaks are important milestones.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full gap-6">
            <Card className="w-full bg-zinc-900 border-zinc-800 p-6 rounded-lg ">
              <CardContent className="p-0 w-full overflow-hidden">
                <ActivityHeatmapCard userData={normalizedData} />
              </CardContent>
            </Card>
          </div>

          {/* Solved Problem */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-purple-400/30 transition-shadow duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg text-zinc-400 mb-4">Solved Problems</h3>
              <ProblemCardList problems={solvedProblems} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
