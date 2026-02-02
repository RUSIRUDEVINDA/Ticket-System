import express from "express";
import {getTickets,createTicket,getTicketById,updateTicket,deleteTicket} from "../controllers/ticket.controller.js";

import { protectRoute } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
