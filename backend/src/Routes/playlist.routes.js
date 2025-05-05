import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, removeProblemFromPlaylist, updatePlaylist } from '../controllers/playlist.controllers.js';

const playlistRoutes = express.Router();

playlistRoutes.get("/", isLoggedIn, getAllPlaylists);
playlistRoutes.get("/:playlistId", isLoggedIn, getPlaylistById);
playlistRoutes.post("/create-playlist", isLoggedIn, createPlaylist);
playlistRoutes.post("/update-playlist/:playlistId", isLoggedIn, updatePlaylist);
playlistRoutes.delete("/delete-playlist/:playlistId", isLoggedIn, deletePlaylist);    
playlistRoutes.post("/:playlistId/add-problem", isLoggedIn, addProblemToPlaylist);
playlistRoutes.post("/:playlistId/remove-problem", isLoggedIn, removeProblemFromPlaylist); 



export default playlistRoutes;