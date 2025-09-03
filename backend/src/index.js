import express from "express"
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
dotenv.config();
import cors from "cors";


const app = express();
const PORT=5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}
))


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRouter);

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});


