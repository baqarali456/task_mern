import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config()




const app = express();

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true,
}))
app.use(cookieParser());

//  import routers 

import { userRouter } from "./src/routes/user.route.js";
import { taskRouter } from "./src/routes/task.route.js";

app.use('/api/v1/user',userRouter)
app.use('/api/v1/task',taskRouter)

export {
    app,
}