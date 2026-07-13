import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Completed"],
        default: "Active",
    },
}, { timestamps: true })

export default mongoose.model("Project", ProjectSchema)
