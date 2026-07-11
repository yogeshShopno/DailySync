import jwt from 'jsonwebtoken'
import sendResponse from '../utils/sendResponse.js'

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