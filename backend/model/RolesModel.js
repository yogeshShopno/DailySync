import mongoose from "mongoose"

const RolesSchema = mongoose.Schema({
    roleName: {
        type: String,
        require: true,
        unique: true,
    },
    permission: {
        type: Array
    }
})


export default Roles.model("Roles", RolesSchema);