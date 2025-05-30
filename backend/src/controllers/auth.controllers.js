import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";  
import {mailService} from "../utils/mail-sending.js"
import crypto from 'crypto'
import {generateAccessRefreshToken} from "../utils/generateAccessRefreshToken.js";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";




//Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email
      },
    });
    
    if (existingUser) {
      
      return res.status(400).json(
        new ApiError(400, "User already exists", ["User already exists"])
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    // const token = jwt.sign({id: newUser.id,}, process.env.JWT_SECRET, {expiresIn:"7d"});

    // res.cookie("jwt", token,{
    //     httpOnly:true,
    //     sameSite:"strict",
    //     secure:process.env.NODE_ENV !== "development",
    //     maxAge: 1000 * 60 * 60 * 24 * 7
    // })
    
    // const verificationToken= crypto.randomBytes(10).toString("hex");
    const verificationToken=jwt.sign({id: email}, process.env.VERIFICATION_SECRET, {expiresIn:process.env.VERIFICATION_TOKEN_EXPIRES_IN});
    
    
    
    //mailtest
    const mailOptions = {
      from: "LEETLAB <test@gmail.com>", 
      to: email, // List of receivers
      subject: "Action Required: Verify Your Email Address", // Subject line
      text: `Hello,\n\nPlease click the link below to verify your email address and complete your registration process:\n\n${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
              <h2 style="color: #4CAF50; text-align: center;">Welcome to LEETLAB!</h2>
              <p>Hello,</p>
              <p>Thank you for signing up. To complete your registration, please click the link below to verify your email address:</p>
              <p style="text-align: center;">
                <a href="${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}" 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Verify Your Email
                </a>
              </p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The LEETLAB Team</p>
            </div>
          </body>
        </html>`,
    };
    
    
    const mail=await mailService(
      mailOptions
    )
    
    
    if(!mail){
      return res.status(400).json(
        new ApiError(400, "Error in sending mail")
      )
    }
    
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
        verificationToken
      },
    });

    res.status(201).json(

      new ApiSuccess(201, {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      }, "User created successfully")
    );


  } catch (error) {
    console.error("Error in creating User", error)
    res.status(500).json(
      new ApiError(500, "Error creating user", [error]))
  }
};






//Verify User from Email
export const userVerify = async (req, res) => {
  const {token} = req.params;
  if(!token){
    return res.status(400).json(
      new ApiError(400, "Token is required")
    )
  }

  const decodedToken = jwt.verify(token, process.env.VERIFICATION_SECRET);
  if(!decodedToken){
    return res.status(400).json(
      new ApiError(400, "Invalid token")
    )
  }
  
  try {
    const user = await db.user.findUnique({
      where:{
        email:decodedToken.id
      }
    })
    if(!user){
      return res.status(400).json(
        new ApiError(400, "User not found")
      )
    }
    if(user.isVerified){
      return res.status(400).json(
        new ApiError(400, "User is already verified")
      )
    }

    await db.user.update({
      where:{
        id:user.id
      },
      data:{
        verificationToken:null,
        isVerified:true
      }
    })
    res.status(200).json(
      new ApiSuccess(200, {
        id:user.id,
        email:user.email,
        name:user.name,
        role:user.role,
        image:user.image
      }, "User verified successfully")
    )
  } catch (error) {
    console.error("Error in verifying User", error)
    res.status(500).json(
      new ApiError(500, "Error   user", [error])
    )
  }
}



//Login User
export const login = async (req, res) => {
  const {email,password} = req.body;
  if(!email || !password){
      return res.status(400).json(
          new ApiError(400, "Email and password are required")
      )
  }
  try {
    const user = await db.user.findUnique({
      where:{email}
    })

    if(!user){
      return res.status(400).json(
        new ApiError(400, "User not found")
      )
    }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    return res.status(400).json(
      new ApiError(400, "Invalid credentials")
    )
  }

  const {accessToken,refreshToken} = generateAccessRefreshToken(user);

  res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development",  
      maxAge: 1000 * 60 * 60 * 24 * 1
    });
  
  res.cookie("accessToken",accessToken,{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development",  
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    db.user.update({
      where:{
        id:user.id
      },
      data:{
        refreshToken:refreshToken
      }
    })


  res.status(200).json({
      success:true,
      message:"User logged in successfully",
      user:{
          id:user.id,
          email:user.email,
          name:user.name,
          role:user.role,
          image:user.image 
      }
  })
  } catch (error) {
    console.log("error",error);
    res.status(500).json({
      success:false,
        error:"Error logging in user"
    })
  }
};

export const logout = async (req, res) => {
 const userId= req.user.id;
  await db.user.update({
    where:{
      id:userId
    },
    data:{
      refreshToken:null
    }
  })
  res.cookie("refreshToken",null,{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development",  
      maxAge: 0
    });
  res.cookie("accessToken",null,{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development",
      maxAge: 0
    });
  res.status(200).json({
      success:true,
      message:"User logged out successfully"
  })
};
export const getProfile = async (req, res) => {
    // const userId= req.cookies.
    const userId= req.user.id;
  
    try {
      const user = await db.user.findUnique({
          where:{
              id:userId
          }
      })
  
      if(!user){
          return res.status(400).json({
              success:false,
              error:"User not found"
          })
      }

      console.log(user, "user from db");
      
      const {accessToken,refreshToken} = generateAccessRefreshToken(user);
      
  
      res.cookie("refreshToken",refreshToken,{
          httpOnly:true,
          sameSite:"strict",
          secure:process.env.NODE_ENV !== "development",  
          maxAge: 1000 * 60 * 60 * 24 * 7
        });
      
      res.cookie("accessToken",accessToken,{
          httpOnly:true,
          sameSite:"strict",
          secure:process.env.NODE_ENV !== "development",  
          maxAge: 1000 * 60 * 60 * 24 * 1
        });
        console.log("cookies from response");
        
       
      return res.status(200).json({
        success:true,
        message:"User profile fetched successfully",
        user:{
            id:user.id,
            email:user.email,
            name:user.name,
            role:user.role,
            image:user.image 
        }
       
      })
    } catch (error) {
      console.error("Error in fetching user profile", error)
      res.status(500).json({
        success:false,
          error:"Error fetching user profile"
      })
      
    }

};

export const check = async (req , res)=>{
    try {
        res.status(200).json({
            success:true,
            message:"User authenticated successfully",
            user:req.user
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error:"Error checking user"
        })
    }
}
