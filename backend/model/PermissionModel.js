import mongoose from "mongoose"

const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    module: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
}, { timestamps: true })

export default mongoose.model("Permission", PermissionSchema)
