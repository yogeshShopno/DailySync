import jwt from 'jsonwebtoken'
import sendResponse from '../utils/sendResponse.js'
import Tasks from '../model/TaskModel.js'
import Users from '../model/UsersModel.js'
import Role from '../model/RoleModel.js'

export const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return sendResponse(res, 401, false, "User is not logged in");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRETE
        )
        req.user = decoded
        next()
    } catch (error) {
        return sendResponse(res, 401, false, "User is not logged in");

    }
}

export const authorization = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        if (!taskId) return next();

        const task = await Tasks.findById(taskId);
        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }

        // Check if user is the owner of the task
        if (task.userId === req.user.id) {
            return next();
        }

        // If not the owner, check if the user is an admin
        const user = await Users.findById(req.user.id).populate('roleId');
        if (user && user.isAdmin) {
            return next();
        }
        
        // Or if they have a role with update_task permission
        if (user && user.roleId) {
            const role = await Role.findById(user.roleId).populate('permissions');
            const hasPermission = role.permissions.some(p => p.name === 'update_task' || p.name === 'delete_task');
            if (hasPermission) return next();
        }

        return sendResponse(res, 403, false, "You do not have permission to perform this action");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const user = await Users.findById(req.user.id).populate({
                path: 'roleId',
                populate: { path: 'permissions' }
            });

            if (!user) {
                return sendResponse(res, 401, false, "User not found");
            }

            // Admins can do everything
            if (user.isAdmin) {
                return next();
            }

            if (!user.roleId || !user.roleId.permissions) {
                return sendResponse(res, 403, false, "No permissions assigned");
            }

            const hasPermission = user.roleId.permissions.some(p => p.name === permissionName);
            
            if (hasPermission) {
                return next();
            } else {
                return sendResponse(res, 403, false, `Permission denied. Requires: ${permissionName}`);
            }
        } catch (error) {
            return sendResponse(res, 500, false, error.message);
        }
    }
}