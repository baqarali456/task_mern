import { asyncHandler } from "../utils/AsyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async(req,res)=>{
    
    const {username,email,password} = req.body;

    if(!username?.trim() || !email?.trim() || !password?.trim()){
        throw new ApiError(400,'fields are required');
    }
    
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new ApiError(409,'user already exists');
    }

    const user = await User.create({
        username,
        email,
        password,
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            user?._id,
            'user registered successfully',
            200
        )
    )


})


const generateAccessandRefreshToken = async(userId) =>{
    try {
       const user = await User.findById(userId);
       const accessToken =user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken;

       await user.save({validateBeforeSave:false})

       return [accessToken,refreshToken]


    } catch (error) {
        throw new ApiError(500,'something went wrong while generating tokens')
    }
}

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    
    if(!email?.trim() || !password?.trim()){
        throw new ApiError(400,'fields are required');
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404,'user not found')
    }


   const isPasswordCorrect = await user.comparePassword(password)

   if(!isPasswordCorrect) throw new ApiError(401,'password is wrong');

  const [accessToken,refreshToken] =  await generateAccessandRefreshToken(user._id)


  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  return res
  .status(200)
  .cookie('accessToken',accessToken,{httpOnly:true,secure:true})
  .cookie('refreshToken',refreshToken,{httpOnly:true,secure:true})
  .json(
    new ApiResponse({loggedinUser,accessToken,refreshToken},'user login successfully',200)
  )




})


const getCurrentUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id)

    return res
    .status(200)
    .json(
        new ApiResponse(user,'get current user successfully',200)
    )
})


const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset:{
                refreshToken:1
            }
        }
    )
    return res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(
        new ApiResponse(null,' user logout successfully',200)
    )
})

export {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser
}