import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getDashboardStats } from "../controller/taskController.js"
import { auth, authorization } from "../middleware/authMiddleware.js"


const router = express.Router();

router.get('/dashboard', auth, getDashboardStats)
router.get('/',auth,  getAllTasks)
router.get('/:id',auth,  getTaskById)
router.post('/',auth,  createTask)
router.put('/:id',auth, authorization, updateTask)
router.delete('/:id',auth, authorization, deleteTask)

export default router;
