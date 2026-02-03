import Ticket from "../models/Ticket.js";

// GET /tickets
// Filters + Search + Pagination

export const getTickets = async (req, res) => {
    try {
        const { status, priority, category, q, page = 1, limit = 10 } = req.query;

        const query = {};

        // Role-based data access
        if (req.user.role !== "admin") {
            query.createdBy = req.user._id;
        }

        // Filters
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;

        // Search by title
        if (q) {
            query.title = { $regex: q, $options: "i" };
        }

        const tickets = await Ticket.paginate(query, {
            page,
            limit,
            sort: { createdAt: -1 },
            populate: "createdBy",
        });

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// POST /tickets
export const createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create({
            ...req.body, // this includes title, description, status, priority, category
            createdBy: req.user._id
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// GET /tickets/:id

export const getTicketById = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    // User access restriction
    if (
        req.user.role !== "admin" &&
        ticket.createdBy.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(ticket);
};


// PUT /tickets/:id

export const updateTicket = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    if (
        req.user.role !== "admin" &&
        ticket.createdBy.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(ticket, req.body);
    await ticket.save();

    res.status(200).json({ ticket, message: "Ticket updated successfully" });
};


// DELETE /tickets/:id

export const deleteTicket = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    if (
        req.user.role !== "admin" &&
        ticket.createdBy.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({ message: "Access denied" });
    }

    await ticket.deleteOne();
    res.status(200).json({ message: "Ticket deleted successfully" });
};

