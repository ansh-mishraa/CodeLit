import { useEffect, useMemo, useState } from "react";
import { useProblemStore } from "../../store/useProblemStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useActions } from "@/store/useAction";
import { Pencil, Trash2, Plus, Bookmark, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

const Problems = () => {
  const { authUser } = useAuthStore();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [tag, setTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [problemSolutions, setProblemSolutions] = useState<{ [key: string]: string }>({}); // Store problem solutions here

  const { createPlaylist, playlists, addProblemToPlaylist, getAllPlaylists } = usePlaylistStore();
  const { getAllProblems, problems = [] } = useProblemStore();
  const { onDeleteProblem } = useActions();

  const itemsPerPage = 5;

  useEffect(() => {
    getAllProblems();
    getAllPlaylists();
    // Fetch problem solutions (example, replace with your actual logic)
    setProblemSolutions({
      // Example problem solutions
      "1": "function solveProblem() { return 42; }",
      "2": "function solveProblem() { return 'Hello World'; }",
      // Add solutions for other problems...
    });
  }, [getAllProblems, onDeleteProblem, getAllPlaylists]);

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    problems.forEach((p) => p.tags?.forEach((t: any) => tags.add(t)));
    return Array.from(tags);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) =>
        difficulty === "ALL" ? true : p.difficulty === difficulty
      )
      .filter((p) => (tag === "ALL" ? true : p.tags?.includes(tag)));
  }, [problems, search, difficulty, tag]);

  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(start, start + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const playlistCreate = (name: string) => {
    createPlaylist({
      name: playlistName,
      description: playlistDescription,
    });
    console.log("Creating playlist:", name);
    setPlaylistName("");
    setPlaylistDescription("");
  };

  const handleDelete = async (id: any) => {
    await onDeleteProblem(id);
    await getAllProblems();
  };

  const loadCode = (problemId: string) => {
    alert(`Loading code for problem ID: ${problemId}\n${problemSolutions[problemId]}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-18 min-h-screen justify-between">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-400">Problem Set</h1>
        <Dialog>
          <DialogTrigger>
            <Button variant="default" className="flex items-center gap-2">
              <Plus size={16} />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Playlist</DialogTitle>
              <DialogDescription>
                <p>Give your playlist a unique name</p>
              </DialogDescription>
              <Label className="mt-5">Playlist Name</Label>
              <Input
                placeholder="Enter Playlist Name"
                className=""
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
              <Label className="mt-5">Description</Label>
              <Input
                placeholder="Description"
                className=""
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
              />
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <div className="flex w-full">
                  <Button
                    className="bg-cyan-600 text-white hover:bg-cyan-700 justify-center cursor-pointer"
                    disabled={playlistName.length < 4}
                    onClick={() => playlistCreate(playlistName)}
                  >
                    Add Playlist
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-end ">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/5 text-sm"
        />
        <Select value={difficulty} onValueChange={(e) => setDifficulty(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Select Difficulty</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tag} onValueChange={(e) => setTag(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Select Tag</SelectItem>
            {uniqueTags.map((t: any) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-sm bg-white dark:bg-[#1a1a1a] border-separate border-spacing-y-1">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-[#494848] text-gray-500 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3">Solved</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy?.some(
                  (u: any) => u.userId === authUser?.id
                );
                const hasSolution = problemSolutions[problem.id];

                return (
                  <tr
                    key={problem.id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-t "
                  >
                    <td className="px-4 py-3 text-center">
                      <CheckCircle
                        size={20}
                        className={`${
                          isSolved ? "text-green-500" : "text-gray-400"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-orange-500 dark:text-white whitespace-nowrap min-w-70 ">
                      <Link to={`/problem/${problem.id}`}>
                        {problem.title.length > 50
                          ? `${problem.title.slice(0, 50)}...`
                          : problem.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          problem.difficulty === "EASY"
                            ? "border-green-400 text-green-600"
                            : problem.difficulty === "MEDIUM"
                            ? "border-yellow-400 text-yellow-600"
                            : "border-red-400 text-red-600"
                        }`}
                      >
                        {problem.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 items-center">
                        {/* Display the first 2 tags */}
                        {problem.tags
                          ?.slice(0, 2)
                          .map((tag: any, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] px-2 py-0.5 rounded"
                            >
                              {tag}
                            </Badge>
                          ))}

                        {/* Show the 'more' badge if there are more than 2 tags */}
                        {problem.tags?.length > 2 && (
                          <div className="relative group">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-2 py-0.5 rounded cursor-pointer border-dashed border-gray-400"
                            >
                              +{problem.tags.length - 2} more
                            </Badge>

                            {/* Tooltip with remaining tags (badge style) */}
                            <div className="absolute z-10 hidden group-hover:flex flex-col gap-1 bg-white dark:bg-gray-800 border dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 shadow-md p-2 rounded-md min-w-[120px] top-full mt-1 left-0">
                              {problem.tags
                                .slice(2)
                                .map((tag: any, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 rounded"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <Link to={`/update-problem/${problem.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-yellow-500"
                              >
                                <Pencil size={16} />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDelete(problem.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                        <Dialog>
                          <DialogTrigger>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs flex items-center gap-1 px-2 py-1"
                            >
                              <Bookmark size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Problem To Playlist</DialogTitle>
                              <DialogDescription>
                                <p>Select a playlist to add this problem.</p>
                              </DialogDescription>
                              <Label className="mt-5">Playlist Name</Label>
                              <select
                                className="select select-bordered w-full"
                                value={selectedPlaylist}
                                onChange={(e) => setSelectedPlaylist(e.target.value)}
                              >
                                <option value="">Select a playlist</option>
                                {playlists.map((playlist) => (
                                  <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                  </option>
                                ))}
                              </select>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <div className="flex w-full">
                                  <Button
                                    className="bg-cyan-600 text-white hover:bg-cyan-700 justify-center cursor-pointer"
                                    onClick={() => addProblemToPlaylist(selectedPlaylist, [problem.id])}
                                  >
                                    Add To Playlist
                                  </Button>
                                </div>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Show the "Load Code" button if the problem has a solution */}
                        {hasSolution && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => loadCode(problem.id)}
                          >
                            Load Code
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Problems;
