import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ---> Middlewares
// Configuring cors middleware
app.use(
    cors({
        // origin: process.env.CORS_ORIGIN,
        origin: "http://localhost:5173",
        credentials: true,
    })
); // To allow data access to specific request or every request coming

app.use(express.json({ limit: "16kb" })); // To identify data coming from json file (JSON Body Parsing Middleware)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // To identify data coming from ULRs (URL-Encoded Data Parsing Middleware)
app.use(express.static("public")); // To serve static files like images, PDFs, CSS files, etc. (Static File Serving Middleware)

app.use(cookieParser());
/* (Cookie Parsing Middleware)
    Purpose: To parse cookies from incoming requests and populate them in req.cookies.
    Essential for handling sessions or authentication tokens.
*/


// ---> Routes
// routes import
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

export { app };
