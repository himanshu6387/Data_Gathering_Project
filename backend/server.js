import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to Database
connectDB();

// ✅ Allowed Origins
const allowedOrigins = [
  "https://data-gathering-project.vercel.app", // your frontend
  "http://localhost:5173", // for local testing (optional)
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// // ✅ Handle Preflight Requests
// app.options("*", cors());

// ✅ Increase JSON Body Limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/student", studentRoutes);

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});





























// import express from "express";
// import dotenv from 'dotenv'
// import connectDB from "./config/database.js";
// import adminRoutes from './routes/adminRoutes.js'
// import authRoutes from './routes/authRoutes.js'
// import collegeRoutes from './routes/collegeRoutes.js'
// import studentRoutes from './routes/studentRoutes.js'
// import cors from 'cors'

// const app = express()

// // / Increase JSON body limit
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cors())
// app.use(express.json())

// dotenv.config()
// connectDB()


// app.use('/api/auth',authRoutes)
// app.use('/api/admin',adminRoutes)
// app.use('/api/college',collegeRoutes)
// app.use('/api/student',studentRoutes)
// const PORT = process.env.PORT

// app.listen(PORT, () => {
//     console.log(`Server is running on PORT http://localhost:${PORT}`)
// })