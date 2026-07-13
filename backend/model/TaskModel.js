import mongoose from "mongoose"

const TasksSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    totalMinutes: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Completed", "In Progress", "Pending", "Blocked"],
        default: "Pending",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
}, { timestamps: true })

export default mongoose.model('Tasks', TasksSchema)
