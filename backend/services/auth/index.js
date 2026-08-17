import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import router from "./routes/auth.route.js";

dotenv.config();


const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/",router)
app.get("/", (req, res) => {
  res.json({ message: "Auth service is running" });
});

app.listen(port, ()=>{
    console.log(`Auth service started at ${port}`);
    connectDb()
})