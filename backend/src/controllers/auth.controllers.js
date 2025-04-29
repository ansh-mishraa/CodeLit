import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";  
import {mailService} from "../utils/mail-sending.js"
import crypto from 'crypto'
import {generateAccessRefreshToken} from "../utils/generateAccessRefreshToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email
      },
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    // const token = jwt.sign({id: newUser.id,}, process.env.JWT_SECRET, {expiresIn:"7d"});

    // res.cookie("jwt", token,{
    //     httpOnly:true,
    //     sameSite:"strict",
    //     secure:process.env.NODE_ENV !== "development",
    //     maxAge: 1000 * 60 * 60 * 24 * 7
    // })
    
    const verificationToken= crypto.randomBytes(10).toString("hex");
    
    
    
    //mailtest
    const mailOptions={
      from: "LEETLAB test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text:   `Visit below link to verify ${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`,// plain text body
      html: `<b>Click below link to verify</b> <a href='${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}'>Verify Email</a>`, // html body
    };
    
    const mail=await mailService(
      mailOptions
    )
    
    
    if(!mail){
      return res.status(400).json({
        success: false,
        error:"Error in sending Mail"
      })
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

    res.status(201).json({
      success:true,
        message:"User created successfully",
        user:{
            id:newUser.id,
            email:newUser.email,
            name:newUser.name,
            role:newUser.role,
            image:newUser.image ,
        }
    })
  } catch (error) {
    console.error("Error in creating User", error)
    res.status(500).json({
      success:false,
        error:"Error creating user"
    })
  }
};







export const userVerify = async (req, res) => {
  const {token} = req.params;
  if(!token){
    return res.status(400).json({
      success:false,
        error:"Token is required"
    })
  }
  try {
    const user = await db.user.findUnique({
      where:{
        verificationToken:token
      }
    })
    if(!user){
      return res.status(400).json({
        success:false,
          error:"Invalid token"
      })
    }

    await db.user.update({
      where:{
        id:user.id
      },
      data:{
        verificationToken:undefined,
        isVerified:true
      }
    })

    res.status(200).json({
      success:true,
        message:"User verified successfully",
        user:{
            id:user.id,
            email:user.email,
            name:user.name,
            role:user.role,
            image:user.image 
        }
    })
  } catch (error) {
    console.error("Error in verifying User", error)
    res.status(500).json({
      success:false,
        error:"Error verifying user"
    })
  }
}




export const login = async (req, res) => {
  const {email,password} = req.body;
  if(!email || !password){
      return res.status(400).json({
          success:false,
          error:"Email and password are required"
      })
  }
  try {
    const user = await db.user.findUnique({
      where:{email}
    })

    if(!user){
      return res.status(400).json({
        success:false,
          error:"User not found"
      })
    }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    return res.status(400).json({
        success:false,
        error:"Invalid credentials"
    })
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
 const userId= req.user;
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
    const userId= req.user;
  
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
