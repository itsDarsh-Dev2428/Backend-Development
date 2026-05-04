import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessandRefreshTokens = async(userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
       const refreshToken =  user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false})

       return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
     // Get user details from frontend
     // validation - not empty
     // check if user already exists
     // check for images, check for avatar 
     // upload them to cloudinary, avatar 
     // create user object - create entry in db
     // remove password and refresh token field from response
     // check for user creation 
     // return res


    const {fullName, username,  email, password} = req.body
    console.log(password, email)
    
    if(
        [fullName, password, email, username].some((field)=> field?.trim()=== "")
    )
    {
        throw new ApiError(400, "All fields are required")
    }
    // else if(!email.includes("@")){
    //     return "email should require @ symbol"
        
    // }
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with Email or Username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar upload failed")
        
    }

    const Avatar = await uploadOnCloudinary(avatarLocalPath)
    const CoverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!Avatar){
        throw new ApiError(500, "Cloudinary avatar upload failed")

    }

    const user = await User.create({
        fullName,
        avatar: Avatar.url,
        coverImage: CoverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
   
   const createdUser = await User.findById(user._id).select(
       "-refreshToken -password"
   )
   if(!createdUser){
    throw new ApiError(500, "something went wrong while registering the user")
   }
   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered  successfully")
   )
})
const loginUser = asyncHandler(async (req, res)=>{
     // req body -> data
     // username, password
    // find the user
    // password check
    // access and refresh Token
    // send cookie

    const {email, username, password}= req.body
    
    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Password is incorrect")
    }
    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)
    
    const loggedinUSER = User.findById(user._id).select("-password  -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true,

    }
    return res
    .status(200).
    cookie("accessToken", accessToken, options).
    cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedinUSER, accessToken, refreshToken
            }
        )
)

     
})

const logoutUser = asyncHandler(async(req, res)=>{
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})
export {registerUser,
        loginUser,
        logoutUser
}