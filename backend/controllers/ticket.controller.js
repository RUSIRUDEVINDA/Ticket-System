import Ticket from "../models/Ticket.js";

// Validation helper functions
const validateTitle = (title) => {
    if (!title || typeof title !== "string") return false;
    const trimmed = title.trim();
    return trimmed.length >= 3 && trimmed.length <= 100;
};

const validateDescription = (description) => {
    if (!description || typeof description !== "string") return false;
    const trimmed = description.trim();
    return trimmed.length >= 5 && trimmed.length <= 5000;
};

const validateStatus = (status) => {
    const validStatuses = ["Open", "In Progress", "Resolved"];
    return validStatuses.includes(status);
};

const validatePriority = (priority) => {
    const validPriorities = ["Low", "Medium", "High"];
    return validPriorities.includes(priority);
};

const validateCategory = (category) => {
    const validCategories = ["Billing", "Technical", "General"];
    return validCategories.includes(category);
};

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
        const { title, description, status, priority, category } = req.body || {};

        // Validate required fields
        if (!title || !description || !category) {
            return res.status(400).json({ error: "Title, description, and category are required" });
        }

        // Validate title
        if (!validateTitle(title)) {
            return res.status(400).json({ error: "Title must be 3-100 characters" });
        }

        // Validate description
        if (!validateDescription(description)) {
            return res.status(400).json({ error: "Description must be 5-5000 characters" });
        }

        // Validate category
        if (!validateCategory(category)) {
            return res.status(400).json({ error: "Invalid category. Must be 'Billing', 'Technical', or 'General'" });
        }

        // Validate status if provided (optional, defaults to "Open")
        if (status && !validateStatus(status)) {
            return res.status(400).json({ error: "Invalid status. Must be 'Open', 'In Progress', or 'Resolved'" });
        }

        // Validate priority if provided (optional, defaults to "Low")
        if (priority && !validatePriority(priority)) {
            return res.status(400).json({ error: "Invalid priority. Must be 'Low', 'Medium', or 'High'" });
        }

        const ticket = await Ticket.create({
            title: title.trim(),
            description: description.trim(),
            status: status || "Open",
            priority: priority || "Low",
            category,
            createdBy: req.user._id
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET /tickets/:id

export const getTicketById = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PUT /tickets/:id

export const updateTicket = async (req, res) => {
    try {
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

        // Validate title if provided
        if (req.body.title && !validateTitle(req.body.title)) {
            return res.status(400).json({ error: "Title must be 3-100 characters" });
        }

        // Validate description if provided
        if (req.body.description && !validateDescription(req.body.description)) {
            return res.status(400).json({ error: "Description must be 5-5000 characters" });
        }

        // Validate status if provided
        if (req.body.status && !validateStatus(req.body.status)) {
            return res.status(400).json({ error: "Invalid status. Must be 'Open', 'In Progress', or 'Resolved'" });
        }

        // Validate priority if provided
        if (req.body.priority && !validatePriority(req.body.priority)) {
            return res.status(400).json({ error: "Invalid priority. Must be 'Low', 'Medium', or 'High'" });
        }

        // Validate category if provided
        if (req.body.category && !validateCategory(req.body.category)) {
            return res.status(400).json({ error: "Invalid category. Must be 'Billing', 'Technical', or 'General'" });
        }

        Object.assign(ticket, req.body);
        await ticket.save();

        res.status(200).json({ ticket, message: "Ticket updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE /tickets/:id

export const deleteTicket = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

