import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import usersRoutes from "./router/usersRoutes.js"

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


app.get('/api', (req, res) =>
    res.send('Hello  from Exommerce, API is running ! '))


app.use('/api/users', usersRoutes)

app.listen(PORT, () => {
    connectDB();
    console.log("server listening to", `http://localhost:${PORT}/api`);
})
