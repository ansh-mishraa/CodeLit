import express from "express";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, solvedProblemsByUser, updateProblem } from "../controllers/problem.controllers.js";


const problemRoutes = express.Router();

problemRoutes.post("/create-problem", isLoggedIn, isAdmin, createProblem);
problemRoutes.get("/get-problems", isLoggedIn, getAllProblems);
problemRoutes.get("/get-problem/:id", isLoggedIn, getProblemById);
problemRoutes.put("/update-problem/:id", isLoggedIn, isAdmin, updateProblem);
problemRoutes.delete("/delete-problem/:id", isLoggedIn, isAdmin, deleteProblem);
problemRoutes.get("/get-solved-problems", isLoggedIn, solvedProblemsByUser);
// problemRoutes.get("/get-problem-submissions/:id", isLoggedIn, getProblemSubmissions);
// problemRoutes.post("/submit-problem/:id", isLoggedIn, submitProblem);

export default problemRoutes;