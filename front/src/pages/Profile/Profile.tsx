import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, CheckCircle, Flame, Star, User } from 'lucide-react';
import PercentageCircle from './components/PercentageCircle';
import { ModeToggle } from '@/components/mode-toggle';
import ReactCalendarHeatmap from 'react-calendar-heatmap';

export default function Profile() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row p-6 gap-6 pt-18">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 flex-shrink-0">
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl mb-6">
          <CardContent className="p-1 flex flex-col items-center text-center">
            <div className="bg-orange-400 w-22 h-22 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              A
            </div>
            <h2 className="text-xl font-semibold mt-4">Ansh Mishra</h2>
            <Button variant="default" className="mt-7 w-5/8 text-orange-400 bg-zinc-700">
              Get Your Codelit Card
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400">Ranking</span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <Trophy size={18} /> 21,764
              </span>
            </div>
            <ModeToggle />
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400">Contests</span>
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <CheckCircle size={18} /> 12
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Stars</span>
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                <Star size={18} /> 5
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Total Solved */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
         
        </Card>

        {/* Problem Difficulty and Percentage Circle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Difficulty */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="text-lg text-zinc-400">Problem Difficulty</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-green-400">Easy</span>
                  <span className="font-bold">55</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400">Medium</span>
                  <span className="font-bold">36</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400">Hard</span>
                  <span className="font-bold">16</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Percentage Circle */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
             <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg text-zinc-400">Total Solved</h3>
              <p className="text-5xl font-bold text-orange-400 mt-2">107</p>
              <p className="text-sm text-zinc-500">Across all platforms</p>
            </div>

            <PercentageCircle easy={4} medium={10} hard={14} />
          </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg text-zinc-400 mb-4">Activity Heatmap</h3>
            <ReactCalendarHeatmap
              startDate={new Date('2025-01-01')}
              endDate={new Date('2025-12-31')}
              values={[
                { date: '2023-01-01', count: 1 },
                { date: '2023-01-02', count: 2 },
                { date: '2023-01-03', count: 3 },
                // Add more data points as needed
              ]}
              classForValue={(value: any) => {
                if (!value) {
                  return 'bg-gray-200';
                }
                return `bg-orange-500`;
              }}
              tooltipDataAttrs={(value: any) => {
                return {
                  'data-tip': `${value.date}: ${value.count} solved`,
                };
              }}
            />
          </CardContent>
        </Card>

        {/* Streaks & Contest Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Streaks */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg text-zinc-400 mb-2">Streaks</h3>
              <div className="flex items-center justify-center gap-8">
                <div>
                  <Flame className="text-orange-500 mx-auto" />
                  <p className="text-sm">Max Streak</p>
                  <p className="font-bold">14</p>
                </div>
                <div>
                  <Flame className="text-zinc-500 mx-auto" />
                  <p className="text-sm">Current Streak</p>
                  <p className="font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Programming */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg text-zinc-400 mb-2">Competitive Programming</h3>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="text-green-400" />
                <p className="text-xl font-bold text-white">12 Contests</p>
              </div>
              <p className="text-sm text-zinc-500 mt-1">Across CodeChef & GFG</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg text-zinc-400 mb-4">Achievements</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
              <li>3rd position in CodeSpring DSA contest (2024)</li>
              <li>Best performer in DBMS Poster Presentation (2024)</li>
              <li>Built full-stack project with login and notes upload (2025)</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
