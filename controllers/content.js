const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับดึงข้อมูลเนื้อหาทั้งหมด
const getContent = async (req, res) => {
  try {
    const contents = await prisma.contents.findMany({
      include: {
        category: {
          select: {
            category_name_en: true,
            category_name_th: true,
            category_name_zh: true,
          },
        },
        imageTitle: {
          select: {
            file_name: true,
            file_path: true,
          },
        },
        imageThumb: {
          select: {
            file_name: true,
            file_path: true,
          },
        },
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            username: true,
          },
        },
      },
    });

    res.json(contents);
  } catch (error) {
    console.error(error); // Log the detailed error to the console
    res
      .status(500)
      .json({ error: "Failed to fetch contents", details: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const result = await prisma.category.findMany({});

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getContent, getCategory };
