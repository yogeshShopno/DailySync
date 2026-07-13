import bcrypt from "bcryptjs";
import Users from "../model/UsersModel.js"
import { sendResponse } from "../utils/sendResponse.js"


export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find()
            .select('-password')
            .populate('roleId', 'name description')
            .populate('departmentId', 'name');
        return sendResponse(res, 200, true, "Users fetched", users);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const getUserById = async (req, res) => {
    let userId = req.params.id
    try {
        const user = await Users.findById(userId)
            .select('-password')
            .populate('roleId', 'name description')
            .populate('departmentId', 'name');
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        return sendResponse(res, 200, true, "User fetched", user);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const createUser = async (req, res) => {
    const { name, email, password, roleId, departmentId, isAdmin, status } = req.body;
    try {
        const user = await Users.findOne({ email: email });
        if (user) {
            return sendResponse(res, 400, true, "User already exist !")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const usersResponse = await Users.create({
            name,
            email,
            password: hashedPassword,
            roleId: roleId || null,
            departmentId: departmentId || null,
            isAdmin: isAdmin || false,
            status: status !== undefined ? status : true,
        })
        const populated = await Users.findById(usersResponse._id)
            .select('-password')
            .populate('roleId', 'name description')
            .populate('departmentId', 'name');
        return sendResponse(res, 201, true, "User registered successfully !", populated)
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const updateUser = async (req, res) => {
    let userId = req.params.id
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        // If password is being updated, hash it
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await Users.findByIdAndUpdate(userId, req.body, { new: true })
            .select('-password')
            .populate('roleId', 'name description')
            .populate('departmentId', 'name');
        return sendResponse(res, 200, true, "User updated !", updatedUser);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const deleteUser = async (req, res) => {
    let userId = req.params.id
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        await Users.findByIdAndDelete(userId)
        return sendResponse(res, 200, true, "User deleted !")
    } catch (error) {
        return sendResponse(res, 500, false, error.message)
    }
}

export const assignRole = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { roleId: req.body.roleId },
            { new: true }
        ).select('-password').populate('roleId', 'name description').populate('departmentId', 'name');
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        return sendResponse(res, 200, true, "Role assigned successfully", user);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const assignDepartment = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { departmentId: req.body.departmentId },
            { new: true }
        ).select('-password').populate('roleId', 'name description').populate('departmentId', 'name');
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        return sendResponse(res, 200, true, "Department assigned successfully", user);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}
