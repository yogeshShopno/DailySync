import mongoose from "mongoose"

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default mongoose.model('Users', UsersSchema)