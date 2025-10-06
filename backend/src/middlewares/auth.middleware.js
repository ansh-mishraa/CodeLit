import jwt from 'jsonwebtoken';
import {db} from "../libs/db.js";

export const isLoggedIn = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "User is not logged in"
        });
    }

    if (accessToken) {
        return jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "User is not logged in",
                    err
                });
            }
            req.user = decoded;
            return next();
        });
    }

    if (refreshToken) {
        return jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "User is not logged in",
                    err
                });
            }

            try {
                const user = await db.user.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, refreshToken: true }
                });

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "User is not logged in, user not found"
                    });
                }

                if (user.refreshToken !== refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "User is not logged in, refresh token does not match"
                    });
                }

                req.user = { id: user.id };
                return next();
            } catch (dbErr) {
                return res.status(500).json({ success: false, message: "Internal error" });
            }
        });
    }
}

// Soft auth: if tokens are valid, attach req.user; otherwise continue as guest
export const tryAuthenticate = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
                req.user = { id: decoded.id };
                return next();
            } catch (_) {
                // fall through to refresh token
            }
        }

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
                const user = await db.user.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, refreshToken: true }
                });
                if (user && user.refreshToken === refreshToken) {
                    req.user = { id: user.id };
                }
            } catch (_) {
                // ignore and proceed as guest
            }
        }

        return next();
    } catch (err) {
        return next();
    }
}


export  const isAdmin = async (req, res, next) => {
   try {
     const userId=req.user.id;
 
     const user = await db.user.findUnique({
         where:{
             id:userId
         },
         select:{
             id:true,
             name:true,
             email:true,
             role:true,
         }
     });
     if(!user){
         return res.status(401).json({
             success:false,
             message:"User is not logged in, user not found"
         })
     }
     console.log(user, "user");
     
     if(user.role !== "ADMIN"){
         return res.status(401).json({
             success:false,
             message:"User is not an admin"
         })
     }
     req.user=user;
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
