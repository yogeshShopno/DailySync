import Users from '../model/UsersModel.js'
import sendResponse from '../utils/sendResponse.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body
    try {

        const user = await Users.findOne({ email })
        if (!user) {
            return sendResponse(res, 404, false, "User not found !");
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {

            return sendResponse(res, 401, false, "Incorrect login details ");
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES
            }
        )
        return sendResponse(res, 200, true, "Logged in successfull !", { ...user, token });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);

    }
}