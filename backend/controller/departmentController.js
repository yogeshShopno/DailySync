import Department from '../model/DepartmentModel.js'
import sendResponse from '../utils/sendResponse.js'

export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 })
        return sendResponse(res, 200, true, "Departments fetched successfully", departments)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id)
        if (!department) {
            return sendResponse(res, 404, false, "Department not found")
        }
        return sendResponse(res, 200, true, "Department fetched successfully", department)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const createDepartment = async (req, res) => {
    try {
        const existing = await Department.findOne({ name: req.body.name })
        if (existing) {
            return sendResponse(res, 400, false, "Department already exists")
        }
        const department = await Department.create({
            name: req.body.name,
            description: req.body.description || "",
            status: req.body.status !== undefined ? req.body.status : true,
        })
        return sendResponse(res, 201, true, "Department created successfully", department)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!department) {
            return sendResponse(res, 404, false, "Department not found")
        }
        return sendResponse(res, 200, true, "Department updated successfully", department)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id)
        if (!department) {
            return sendResponse(res, 404, false, "Department not found")
        }
        return sendResponse(res, 200, true, "Department deleted successfully", department)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}
