import mongoose from "mongoose"

const TasksSchema = mongoose.Schema({
    taskName:{
        type:String,
    },
    userId:{
        ref:"User"
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    totalMinutes:{
        type:Date,
    },
    status:{
        type:String
    },
})


export default Tasks.model("Tasks",TasksSchema);
