import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import usersRoutes from "./router/usersRoutes.js"
import tasksRoutes from "./router/tasksRoutes.js"
import departmentRoutes from "./router/departmentRoutes.js"
import permissionRoutes from "./router/permissionRoutes.js"
import roleRoutes from "./router/roleRoutes.js"
import projectRoutes from "./router/projectRoutes.js"

import { login } from "./controller/authController.js"
const PORT = process.env.PORT || 5050;

dotenv.config();

const app = express()

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected ✔️`)
    } catch (error) {
        console.error("MongoDB connection failed ❌")

    }
}

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());


app.get('/api', (req, res) => {
    res.send('Hello ! from Ecommerce , API is running ! ')
})

app.post('/api/login', login)
app.use('/api/users', usersRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/permissions', permissionRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/projects', projectRoutes)


app.listen(PORT, () => {
    connectDB();
    console.log("server listening to", `http://localhost:${PORT}/api`);
})
