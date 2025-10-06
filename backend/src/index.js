import express from "express"
import dotenv from "dotenv"
import authRoutes from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser"
import problemRoutes from "./Routes/problems.routes.js";
import executionRoutes from "./Routes/codeExecution.routes.js";
import submissionRoutes from "./Routes/submission.routes.js";
import playlistRoutes from "./Routes/playlist.routes.js";
// import swaggerUi from "swagger-ui-express";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerDocument from "../swagger-output.json";
import cors from "cors"
import fs from 'fs';
import path from 'path';


dotenv.config(
    {path:"./src/.env"}
);
// const swaggerSpec = JSON.parse(
//     fs.readFileSync(path.resolve('./swagger-output.json'), 'utf8')
//   );
const app = express();
// CORS: allow dev and prod origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    })
)
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Welcome to LEETLAB")
})


// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/code-execution", executionRoutes)
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes);
const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})