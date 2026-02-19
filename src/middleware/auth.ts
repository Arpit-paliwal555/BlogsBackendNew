import jwt from "jsonwebtoken";
import {Request, Response} from "express";
const SECRET = process.env.SECRET || "default_secret";


export const authMiddleware = (req:Request, res:Response, next:Function) => {
    const token = req.cookies.token;
     
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, SECRET) as {userId:number};
        //@ts-ignore
        req.user = decoded.user;
        req.userId = decoded.userId;
        next();
    } catch(err){
        return res.status(401).json({message:"Invalid token"});
    }
}