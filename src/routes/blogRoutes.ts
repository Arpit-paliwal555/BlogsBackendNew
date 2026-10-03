
import { Router } from "express";
import { validate, blogCreateSchema, blogUpdateSchema } from "../middleware/validate";
import { listBlogs, listBlogsByUserid, getBlog, createBlog, updateBlog, deleteBlog, incrementView } from "../controller/blogController";
import { imageUpload } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", listBlogs);
router.get("/users/:userId", listBlogsByUserid);
router.get("/:id", getBlog);
router.post("/", authMiddleware, imageUpload.single("image"), validate(blogCreateSchema), createBlog);
router.patch("/:id", authMiddleware, validate(blogUpdateSchema), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

// increment views
router.patch("/:id/views", authMiddleware, incrementView);

export default router;
