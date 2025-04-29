import jwt from 'jsonwebtoken';
import {db} from "../libs/db.js";

export const isLoggedIn = (req, res, next) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!accessToken || !refreshToken){
        return res.status(401).json({
            success:false,
            message:"User is not logged in, both tokens are required"
        })
    }

    if(accessToken){   
        
        req.user = jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    success:false,
                    message:"User is not logged in",
                    err
                })
            }
            console.log(decoded, "decoded");
            
            
            req.user = decoded; 
             next(); 
        })

    }
    if(!accessToken && refreshToken){
        console.log("refresh token");
        req.user = jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    success:false,
                    message:"User is not logged in",
                    err
                })
            }

        const user = db.user.findUnique({
            where:{
                id:req.user.id
            }
        });
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not logged in, user not found"
            })
        }
        if(user.refreshToken !== refreshToken){
            return res.status(401).json({
                success:false,
                message:"User is not logged in, refresh token does not match"
            })
        }
            
            req.user = decoded;
            
             next();
        })
    }
    
    return;

}


export  const isAdmin = (req, res, next) => {
   try {
     const userId=req.user.id;
 
     const user = db.user.findUnique({
         where:{
             id:userId
         }
     });
     if(!user){
         return res.status(401).json({
             success:false,
             message:"User is not logged in, user not found"
         })
     }
     if(user.role !== "ADMIN"){
         return res.status(401).json({
             success:false,
             message:"User is not an admin"
         })
     }
     next(); 
   } catch (error) {
     console.log(error);
     return res.status(500).json({
         success:false,
         message:"Something went wrong",
         error:error.message
     })
    
   }
}
