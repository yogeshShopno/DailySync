import express from "express"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, } from "../controller/usersController.js"
import { auth } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get('/', auth, getAllUsers)
router.get('/:id', auth, getUserById)
router.post('/', createUser)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteUser)

export default router;