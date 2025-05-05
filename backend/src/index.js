import express from "express"
import dotenv from "dotenv"
import authRoutes from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser"
import problemRoutes from "./Routes/problems.routes.js";
import executionRoutes from "./Routes/codeExecution.routes.js";

dotenv.config(
    {path:"./src/.env"}
);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Welcome to LEETLAB")
})


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/code-execution", executionRoutes)

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})