import express from 'express';
import { countSubmissionsByProblemId, getAllSubmissions, getSubmissionByProblemId } from '../controllers/submission.controllers.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", isLoggedIn, getAllSubmissions);
submissionRoutes.get("/get-submission/:problemId", isLoggedIn, getSubmissionByProblemId);
submissionRoutes.get("/get-submissions-count/:problemId",  isLoggedIn, countSubmissionsByProblemId);

export default submissionRoutes;