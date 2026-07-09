import { sendResponse } from "../utils/sendResponse.js"

export const getAllUsers = async (req, res) => {
    return sendResponse(res, 200, true, "Users fetched", {
        name: "yogesh",
        mobile: 9876543210,
    });
}


export const getUserById = async (req, res) => {
    return sendResponse(res, 200, true, "User fetched ", {
        name: "yogesh",
        mobile: 9876543210,
    });
}


export const createUser = async (req, res) => {
    return sendResponse(res, 201, true, "User registered successfully", {
        name: "yogesh",
        mobile: 9876543210,
    })
}


export const updateUser = async (req, res) => {
    return sendResponse(res, 200, true, "Profile updated !", {
        name: "yogesh",
        mobile: 9909097033
    })
}

export const deleteUser = async (req, res) => {
    return sendResponse(res, 200, true, "User deleted !")
}
