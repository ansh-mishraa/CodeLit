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
            
            
            req.user = decoded.id;
            console.log(req.user, "after:user id from access token");
            
            
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
            
            req.user = decoded.id;
            
             next();
        })
    }
    
    return;

}