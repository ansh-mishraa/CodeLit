import express from "express"
import dotenv from "dotenv"
import authRoutes from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser"

dotenv.config(
    {path:"./src/.env"}
);

const app =express();

app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Welcome to LEETLAB")
})

app.use("/api/v1/auth", authRoutes)

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})