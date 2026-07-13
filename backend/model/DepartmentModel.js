import mongoose from "mongoose"

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

export default mongoose.model("Department", DepartmentSchema)
