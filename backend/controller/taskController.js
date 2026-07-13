import Tasks from '../model/TaskModel.js'
import sendResponse from '../utils/sendResponse.js'

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await Tasks.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalMinutes: { $sum: "$totalMinutes" }
                }
            }
        ]);

        const totalTasks = await Tasks.countDocuments();

        let analytics = {
            total: totalTasks,
            completed: 0,
            inProgress: 0,
            pending: 0,
            blocked: 0,
            totalMinutes: 0
        };

        stats.forEach(stat => {
            if (stat._id === 'Completed') analytics.completed = stat.count;
            if (stat._id === 'In Progress') analytics.inProgress = stat.count;
            if (stat._id === 'Pending') analytics.pending = stat.count;
            if (stat._id === 'Blocked') analytics.blocked = stat.count;
            analytics.totalMinutes += stat.totalMinutes;
        });

        return sendResponse(res, 200, true, "Dashboard stats fetched successfully", analytics);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find()
            .populate('userId', 'name email roleId isAdmin')
            .populate('projectId', 'name');
        return sendResponse(res, 200, true, "Tasks fetched successfully", tasks)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const getTaskById = async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id)
            .populate('userId', 'name email roleId isAdmin')
            .populate('projectId', 'name');
        if (!task) {
            return sendResponse(res, 404, false, "Task not found")
        }
        return sendResponse(res, 200, true, "Task fetched successfully", task)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const createTask = async (req, res) => {
    try {
        const createdTask = await Tasks.create({
            taskName: req.body.taskName,
            userId: req.user.id,           
            projectId: req.body.projectId || null,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            totalMinutes: req.body.totalMinutes || 0,
            status: req.body.status || "Pending",
            priority: req.body.priority || "Medium",
        })
        // Populate before responding
        const populated = await createdTask.populate([
            { path: 'userId', select: 'name email roleId isAdmin' },
            { path: 'projectId', select: 'name' }
        ])
        return sendResponse(res, 201, true, "Task created successfully", populated);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id);
        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }
        const updatedTask = await Tasks.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('userId', 'name email roleId isAdmin')
        .populate('projectId', 'name');
        return sendResponse(res, 200, true, "Task updated successfully", updatedTask)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.id)
        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }
        return sendResponse(res, 200, true, "Task deleted successfully", task)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}