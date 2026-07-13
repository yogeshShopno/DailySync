import express from 'express'
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from '../controller/projectController.js'
import { auth, checkPermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', auth, checkPermission('view_projects'), getAllProjects)
router.get('/:id', auth, checkPermission('view_projects'), getProjectById)
router.post('/', auth, checkPermission('create_project'), createProject)
router.put('/:id', auth, checkPermission('update_project'), updateProject)
router.delete('/:id', auth, checkPermission('delete_project'), deleteProject)

export default router
