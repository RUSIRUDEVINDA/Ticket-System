import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ["Billing", "Technical", "General"],
            required: true
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low"
        },
        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved"],
            default: "Open"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

ticketSchema.plugin(paginate);

export default mongoose.model("Ticket", ticketSchema);
