import express from "express";
import dotenv from 'dotenv'
import connectDB from "./config/database.js";
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import collegeRoutes from './routes/collegeRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import cors from 'cors'

const app = express()

// / Increase JSON body limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors())
app.use(express.json())

dotenv.config()
connectDB()


app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/college',collegeRoutes)
app.use('/api/student',studentRoutes)
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`)
})