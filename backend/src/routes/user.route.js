import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getCurrentUser,loginUser,logoutUser,registerUser} from "../controllers/user.controller.js"

const userRouter = Router();

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT,logoutUser)
userRouter.route('/getCurrentUser').get(verifyJWT,getCurrentUser)





export {
    userRouter
}
