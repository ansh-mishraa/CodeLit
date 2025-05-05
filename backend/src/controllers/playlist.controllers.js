import { db } from "../libs/db.js";

export const getAllPlaylists = async (req, res) => {
  const userId = req.user.id;

  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      playlists,
      message: "Playlists retrieved successfully",
    });
  } catch (error) {
    console.log("Error in getting playlists", error);
    res.status(500).json({
      success: false,
      error: "Error in getting playlists",
    });
  }
};

export const createPlaylist = async (req, res) => {
  const { name, description } = req.body;
    const userId = req.user.id;
    console.log(userId);
    
  try {
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: "Name and description are required",
      });
    }

    const existingPlaylist = await db.playlist.findFirst({
      where: {
        name,
        userId
      },
    });
    if (existingPlaylist) {
      return res.status(400).json({
        success: false,
        error: "Playlist already exists",
      });
    }
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId
      },
    });
    if (!playlist) {
      return res.status(500).json({
        success: false,
        error: "Error in creating playlist",
      });
    }
    return res.status(200).json({
      success: true,
      playlist,
      message: "Playlist created successfully",
    });
  } catch (error) {
    console.log("Error in creating playlist", error);
    res.status(500).json({
      success: false,
      error: "Error in creating playlist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    return res.status(400).json({
      success: false,
      error: "Playlist id is required",
    });
  }
  try {
    const playlist = await db.playlist.delete({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
    });
    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: "Playlist not found",
      });
    }
    return res.status(200).json({
      success: true,
      playlist,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting playlist", error);
    res.status(500).json({
      success: false,
      error: "Error in deleting playlist",
    });
  }
};

export const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params;
    const userId = req.user.id;
  try {
    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: "Playlist not found",
      });
    }

    const updatedPlaylist = await db.playlist.update({
      where: {
        id: playlistId,
        userId
      },
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    return res.status(200).json({
      success: true,
      updatedPlaylist,
      message: "Playlist updated successfully",
    });
  } catch (error) {
    console.log("Error in updating playlist", error);
    res.status(500).json({
      success: false,
      error: "Error in updating playlist",
    });
  }
};

export const getPlaylistById = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      playlist,
      message: "Playlist retrieved successfully",
    });
  } catch (error) {
    console.log("Error in getting playlist", error);
    res.status(500).json({
      success: false,
      error: "Error in getting playlist",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Problem ids are required",
      });
    }

    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    if (!problemsInPlaylist) {
      return res.status(404).json({
        success: false,
        error: "Playlist not found",
      });
    }

    return res.status(201).json({
      success: true,
      problemsInPlaylist,
      message: "Problems added to playlist successfully",
    });
  } catch (error) {
    console.log("Error in adding problem to playlist", error);
    res.status(500).json({
      success: false,
      error: "Error in adding problem to playlist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Problem ids are required",
      });
    }

    const deletedProblems = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    if (!deletedProblems) {
      return res.status(404).json({
        success: false,
        error: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedProblems,
      message: "Problems removed from playlist successfully",
    });
  } catch (error) {
    console.log("Error in removing problem from playlist", error);
    res.status(500).json({
      success: false,
      error: "Error in removing problem from playlist",
    });
  }
};
