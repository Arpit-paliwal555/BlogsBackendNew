//import { Prisma } from '../../generated/client';
import {prisma} from '../lib/prisma';
import { Request, Response } from "express";

export async function getUsers(req:Request, res:Response ){
  try{
    const users = await prisma.user.findMany({
      include:{
        blogPosts:true,
        imagePosts:true
      }
    });
    return res.status(200).json(users);
  } catch(err){
    console.error("getUsers error:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  } 
}

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try{
    await prisma.user.delete({where:{id}});
    return res.status(204).json({message:"User deleted"});
  }catch (err){
    console.log("error deleting the user");
    return res.status(500).json({
      message:"Internal server error"
    })
  }
}