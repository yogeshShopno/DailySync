import mongoose from "mongoose "

const ProjectSchema = mongoose.Schema({
    projectName: {
        type: String,
        unique: true,
        required: true,
    },
    projectStatus: {
        type: String,
        required: true,
    },
    taskCount:{
        type: Number,
        
    }
})