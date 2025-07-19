import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/user.js";
import adminRoutes from "./src/routes/admin.js";
import connectToMongoUrl from "./src/config/db.js";
import { checkForAuthenticationCookie } from "./src/middlewares/authentication.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectToMongoUrl(process.env.MONGO_URL)
    .then(() => console.log("MongoDb connected Successfully"))
    .catch((err) => console.log(err));

// Body parsing middleware must come BEFORE routes
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser()); 
app.use(checkForAuthenticationCookie("token"));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
    res.json({
        page: "home",
    });
})


app.listen(PORT, '0.0.0.0', (req, res) => {
    console.log("Server Started on Port: " + PORT);
});