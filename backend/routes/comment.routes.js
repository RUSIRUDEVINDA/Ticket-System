import express from "express";
import { addComment, getCommentsByTicket } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

// Merge params to access :id from parent route(tickets)
const router = express.Router({ mergeParams: true });

// All comment routes require authentication
router.use(protect);

router.post("/:id/comments", addComment);
router.get("/:id/comments", getCommentsByTicket);

export default router;
