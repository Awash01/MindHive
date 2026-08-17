import "dotenv/config";
import express from "express";

import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use("/", router)
app.get("/", (req, res) => {
  res.json({ message: "Hello from Agent" });
});

app.listen(port, ()=>{
    console.log(`Agent service started at ${port}`);
    connectDb()
})