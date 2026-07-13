import express from 'express'
import { getAllPermissions, createPermission } from '../controller/permissionController.js'
import { auth, checkPermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', auth, checkPermission('view_permissions'), getAllPermissions)
router.post('/', auth, checkPermission('create_permission'), createPermission)

export default router
