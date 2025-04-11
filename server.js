const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authController = require("./controllers/authController");
const {
  getContent,
  createContent,
  getCategory,
} = require("./controllers/content");

dotenv.config();

const app = express();

// ตั้งค่า CORS ให้รองรับการร้องขอจาก frontend
app.use(
  cors({
    origin: "*", // หรือ '*' ถ้าต้องการอนุญาตทุก origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, this is the backend API!");
});
app.get("/content", getContent); // ดึงข้อมูลเนื้อหาทั้งหมด
app.get("/category", getCategory); // ดึงข้อมูลเนื้อหาทั้งหมด

// Route สำหรับการเข้าสู่ระบบ (Login)
app.post("/api/auth/login", authController.login);
// app.post("/content/create", createContent);

app.listen(3004, () => {
  console.log("Server is running on http://localhost:3004");
});
