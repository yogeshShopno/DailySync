import Project from '../model/ProjectModel.js'
import sendResponse from '../utils/sendResponse.js'

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('departmentId', 'name').sort({ name: 1 })
        return sendResponse(res, 200, true, "Projects fetched successfully", projects)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('departmentId', 'name')
        if (!project) {
            return sendResponse(res, 404, false, "Project not found")
        }
        return sendResponse(res, 200, true, "Project fetched successfully", project)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const createProject = async (req, res) => {
    try {
        const project = await Project.create({
            name: req.body.name,
            description: req.body.description || "",
            departmentId: req.body.departmentId || null,
            status: req.body.status || "Active",
        })
        const populated = await project.populate('departmentId', 'name')
        return sendResponse(res, 201, true, "Project created successfully", populated)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('departmentId', 'name')
        if (!project) {
            return sendResponse(res, 404, false, "Project not found")
        }
        return sendResponse(res, 200, true, "Project updated successfully", project)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id)
        if (!project) {
            return sendResponse(res, 404, false, "Project not found")
        }
        return sendResponse(res, 200, true, "Project deleted successfully", project)
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}
