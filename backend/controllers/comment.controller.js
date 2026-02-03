import Comment from "../models/Comment.js";
import Ticket from "../models/Ticket.js";

// POST /tickets/:id/comments 
export const addComment = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // User can comment only on own ticket (admin allowed)
        if (
            req.user.role !== "admin" &&
            ticket.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const comment = await Comment.create({
            ticketId: ticket._id,
            message: req.body.message,
            createdBy: req.user._id
        });

        res.status(201).json({ message: "Comment added successfully", comment });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /tickets/:id/comments
export const getCommentsByTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Access control
        if (
            req.user.role !== "admin" &&
            ticket.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const comments = await Comment.find({ ticketId: ticket._id })
            .populate("createdBy", "name email")
            .sort({ createdAt: 1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
