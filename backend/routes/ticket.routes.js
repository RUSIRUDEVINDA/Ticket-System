import express from "express";
import { getTickets, createTicket, getTicketById, updateTicket, deleteTicket } from "../controllers/ticket.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All ticket routes require authentication
router.use(protect);

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
