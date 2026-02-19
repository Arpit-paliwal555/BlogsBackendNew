import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;   // or number, depending on your DB
  }
}