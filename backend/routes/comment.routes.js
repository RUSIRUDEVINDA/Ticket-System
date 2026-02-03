import express from "express";
import { addComment, getCommentsByTicket } from "../controllers/comment.controller.js";

import { protectRoute } from "../middleware/role.middleware.js";

// Merge params to access :id from parent route(tickets)
const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router.post("/:id/comments", addComment);
router.get("/:id/comments", getCommentsByTicket);

export default router;
