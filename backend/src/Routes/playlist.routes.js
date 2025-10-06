import express from 'express';
import { isLoggedIn, tryAuthenticate } from '../middlewares/auth.middleware.js';
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, removeProblemFromPlaylist, updatePlaylist } from '../controllers/playlist.controllers.js';

const playlistRoutes = express.Router();

// Allow guests to view playlists, require auth for mutations
playlistRoutes.get("/", tryAuthenticate, getAllPlaylists);
playlistRoutes.get("/:playlistId", tryAuthenticate, getPlaylistById);
playlistRoutes.post("/create-playlist", isLoggedIn, createPlaylist);
playlistRoutes.post("/update-playlist/:playlistId", isLoggedIn, updatePlaylist);
playlistRoutes.delete("/delete-playlist/:playlistId", isLoggedIn, deletePlaylist);    
playlistRoutes.post("/:playlistId/add-problem", isLoggedIn, addProblemToPlaylist);
playlistRoutes.post("/:playlistId/remove-problem", isLoggedIn, removeProblemFromPlaylist); 



export default playlistRoutes;