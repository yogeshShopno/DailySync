import express from 'express'
import { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from '../controller/departmentController.js'
import { auth, checkPermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', auth, checkPermission('view_departments'), getAllDepartments)
router.get('/:id', auth, checkPermission('view_departments'), getDepartmentById)
router.post('/', auth, checkPermission('create_department'), createDepartment)
router.put('/:id', auth, checkPermission('update_department'), updateDepartment)
router.delete('/:id', auth, checkPermission('delete_department'), deleteDepartment)

export default router
