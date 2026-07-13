import mongoose from "mongoose"

const TasksSchema = mongoose.Schema({
    taskName: {
        type: String,
    },
    userId: {
        type: String,

    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    totalMinutes: {
        type: Date,
    },
    status: {
        type: String
    },
})

export default mongoose.model('Tasks',TasksSchema)

