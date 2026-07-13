import express from 'express'
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole, assignPermissions } from '../controller/roleController.js'
import { auth, checkPermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', auth, checkPermission('view_roles'), getAllRoles)
router.get('/:id', auth, checkPermission('view_roles'), getRoleById)
router.post('/', auth, checkPermission('create_role'), createRole)
router.put('/:id', auth, checkPermission('update_role'), updateRole)
router.delete('/:id', auth, checkPermission('delete_role'), deleteRole)
router.put('/:id/permissions', auth, checkPermission('assign_permissions'), assignPermissions)

export default router
