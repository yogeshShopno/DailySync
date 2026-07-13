import Tasks from '../model/TaskModel.js'
import sendResponse from '../utils/sendResponse.js'

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find()
        if (!tasks) {
            return sendResponse(res, 400, true, "Task not found ")

        }
        return sendResponse(res, 200, true, "Task fetched successfully", tasks)

    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const getTaskById = async (req, res) => {
    const task = await Tasks.findById(req.params.id)
    try {
        if (!task) {
            return sendResponse(res, 400, true, "Task not found ")
        }
        return sendResponse(res, 200, true, "Task fetched successfully", task)

    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const createTask = async (req, res) => {

    try {
        const createdTask = await Tasks.create({
            id: Tasks._id,
            taskName: req.body.taskName,
            userId: req.body.userId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            totalMinutes: req.body.totalMinutes,
            status: req.body.status,

        })
        return sendResponse(res, 200, true, "Task created successfully", createdTask);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id);
        if (!task) {
            return sendResponse(res, 404, false, "task not found");
        }
        const updatedTask = await Tasks.findByIdAndUpdate(
            req.params.id,
            req.body,

        )
        return sendResponse(res, 200, true, "Task updated successfully", updatedTask)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Tasks.findByIdAndDelete(req.params._id)
        return sendResponse(res, 200, true, "Task deleted successfully", deleteTask)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }

}