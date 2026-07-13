import bcrypt from "bcryptjs";

import Users from "../model/UsersModel.js"
import { sendResponse } from "../utils/sendResponse.js"


export const getAllUsers = async (req, res) => {

    try {
        const users = await Users.find();
        return sendResponse(res, 200, true, "Users fetched", users);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const getUserById = async (req, res) => {

    let userId = req.params.id

    try {
        const user = await Users.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        return sendResponse(res, 200, true, "User fetched", user);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const createUser = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        isAdmin,
        status
    } = req.body;
    try {

        const user = await Users.findOne({ email: email });

        if (user) {
            return sendResponse(res, 400, true, "User already exist !")

        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const usersResponse = await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            isAdmin: isAdmin,
            status: status,
        })
        return sendResponse(res, 201, true, "User registered successfully !", usersResponse)
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
        const updatedUsed = await Users.findByIdAndUpdate(userId, req.body,)

        return sendResponse(res, 200, true, "User updated !", updatedUsed);
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
        return sendResponse(res, 200, true, error.message)
    }
}
