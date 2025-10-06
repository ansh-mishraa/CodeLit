import express from "express";
import { isAdmin, isLoggedIn, tryAuthenticate } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, solvedProblemsByUser, updateProblem, solvedProblemByAllUsers, getUserNameById } from "../controllers/problem.controllers.js";


const problemRoutes = express.Router();

problemRoutes.post("/create-problem", isLoggedIn, isAdmin, createProblem);
// Public read endpoints (auth optional)
problemRoutes.get("/get-problems", getAllProblems);
problemRoutes.get("/get-problem/:id", tryAuthenticate, getProblemById);
problemRoutes.put("/update-problem/:id", isLoggedIn, isAdmin, updateProblem);
problemRoutes.delete("/delete-problem/:id", isLoggedIn, isAdmin, deleteProblem);
problemRoutes.get("/get-solved-problems", isLoggedIn, solvedProblemsByUser);
problemRoutes.get("/all-solvedby", isLoggedIn, solvedProblemByAllUsers);
problemRoutes.get("/user-name/:id", isLoggedIn, getUserNameById);
// problemRoutes.get("/get-problem-submissions/:id", isLoggedIn, getProblemSubmissions);
// problemRoutes.post("/submit-problem/:id", isLoggedIn, submitProblem);

export default problemRoutes;