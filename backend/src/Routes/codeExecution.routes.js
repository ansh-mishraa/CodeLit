import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {executeCode } from "../controllers/codeExecution.controllers.js";

const executionRoutes = express.Router();


executionRoutes.post("/", isLoggedIn, executeCode);


export default executionRoutes;