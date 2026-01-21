import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async(req,res,next)=>{
     const accessToken = req.cookies?.accessToken || req.header('Authorization')?.slice(1);

     if(!accessToken){
        throw new ApiError(400,'accessToken is required')
     }

     const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

     const user = await User.findById(decodedToken?._id)

     if(!user){
        throw new ApiError(404,'user not found ')
     }

     if(user._id.toString() !== decodedToken?._id){
        throw new ApiError(401,'unauthorized request')
     }

     req.user = user;

     next()

})

export {
    verifyJWT,
}