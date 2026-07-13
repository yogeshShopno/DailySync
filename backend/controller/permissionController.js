import Permission from '../model/PermissionModel.js'
import sendResponse from '../utils/sendResponse.js'

export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().sort({ module: 1, name: 1 })
        return sendResponse(res, 200, true, "Permissions fetched successfully", permissions)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const createPermission = async (req, res) => {
    try {
        const existing = await Permission.findOne({ name: req.body.name })
        if (existing) {
            return sendResponse(res, 400, false, "Permission already exists")
        }
        const permission = await Permission.create({
            name: req.body.name,
            module: req.body.module,
            description: req.body.description || "",
        })
        return sendResponse(res, 201, true, "Permission created successfully", permission)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}
