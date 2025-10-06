import express from "express";
import { tryAuthenticate } from "../middlewares/auth.middleware.js";
import {executeCode } from "../controllers/codeExecution.controllers.js";

const executionRoutes = express.Router();


// Allow guests to execute but they won't have submissions saved
executionRoutes.post("/", tryAuthenticate, executeCode);


export default executionRoutes;