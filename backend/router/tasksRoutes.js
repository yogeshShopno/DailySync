import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controller/taskController.js"
import { auth } from "../middleware/authMiddleware.js"


const router = express.Router();

router.get('/',auth,  getAllTasks)
router.get('/:id',auth,  getTaskById)
router.post('/',auth,  createTask)
router.put('/:id',auth,  updateTask)
router.delete('/:id',auth,  deleteTask)

export default router;

