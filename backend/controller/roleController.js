import Role from '../model/RoleModel.js'
import sendResponse from '../utils/sendResponse.js'

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions').sort({ name: 1 })
        return sendResponse(res, 200, true, "Roles fetched successfully", roles)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions')
        if (!role) {
            return sendResponse(res, 404, false, "Role not found")
        }
        return sendResponse(res, 200, true, "Role fetched successfully", role)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const createRole = async (req, res) => {
    try {
        const existing = await Role.findOne({ name: req.body.name })
        if (existing) {
            return sendResponse(res, 400, false, "Role already exists")
        }
        const role = await Role.create({
            name: req.body.name,
            description: req.body.description || "",
            permissions: req.body.permissions || [],
        })
        const populated = await role.populate('permissions')
        return sendResponse(res, 201, true, "Role created successfully", populated)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('permissions')
        if (!role) {
            return sendResponse(res, 404, false, "Role not found")
        }
        return sendResponse(res, 200, true, "Role updated successfully", role)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id)
        if (!role) {
            return sendResponse(res, 404, false, "Role not found")
        }
        return sendResponse(res, 200, true, "Role deleted successfully", role)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const assignPermissions = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { permissions: req.body.permissions },
            { new: true }
        ).populate('permissions')
        if (!role) {
            return sendResponse(res, 404, false, "Role not found")
        }
        return sendResponse(res, 200, true, "Permissions assigned successfully", role)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}
