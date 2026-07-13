import express from "express"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, assignRole, assignDepartment } from "../controller/usersController.js"
import { auth, checkPermission } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get('/', auth, checkPermission('view_users'), getAllUsers)
router.get('/:id', auth, checkPermission('view_users'), getUserById)
router.post('/', auth, checkPermission('create_user'), createUser)
router.put('/:id', auth, checkPermission('update_user'), updateUser)
router.delete('/:id', auth, checkPermission('delete_user'), deleteUser)
router.put('/:id/role', auth, checkPermission('assign_role'), assignRole)
router.put('/:id/department', auth, checkPermission('assign_department'), assignDepartment)

export default router;