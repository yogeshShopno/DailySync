import mongoose from "mongoose"

const DepartmentSchema = mongoose.Schema({
    departmentName:{
        type:String,
        unique:true,
        require:true,
    },
    StaffCount:{
        type:Number,

    }
})