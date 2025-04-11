const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET; // ดึงค่า JWT_SECRET จาก .env

// ฟังก์ชันสำหรับการล็อกอิน
const login = async (req, res) => {
  const { username, password } = req.body;
  // console.log("Login request:", username, password);

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ username
    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // ใช้ password แทน password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // สร้าง JWT Token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // ส่งข้อมูลทั้งหมดของผู้ใช้และ token กลับ
    res.json({
      message: "Login successful",
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email, // ถ้ามีฟิลด์ email ในฐานข้อมูล
        // fullName: user.fullName, // ถ้ามีฟิลด์ fullName
        // สามารถเพิ่มข้อมูลเพิ่มเติมจากฐานข้อมูลได้ที่นี่
      },
    });
  } catch (error) {
    console.error("Database error:", error);

    // ตรวจสอบประเภทข้อผิดพลาดและส่งข้อความที่เหมาะสม
    if (error.code === "P2002") {
      // ข้อผิดพลาดที่เกี่ยวกับ Prisma (เช่น unique constraint violation)
      return res.status(500).json({
        error: "Database constraint error",
        details: error.message,
      });
    }

    // ถ้ามีข้อผิดพลาดอื่น ๆ ส่ง 500
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

module.exports = { login };
