import express from "express";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import cors from "cors"
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

// Cấu hình Multer để lưu file tạm thời
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.STRING, nullable: false },
    comment: { type: SchemaType.STRING, nullable: false },
    suggest: { type: SchemaType.STRING, nullable: false },
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

app.post("/evaluate", upload.single("audio"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const topic = "Describe a difficult decision you had to make";
  const prompt = `Tôi có 1 file speaking sau về chủ đề \"${topic}\". Hãy giúp tôi 3 việc sau: đầu tiên là chấm điểm, thứ 2 là nhận xét (bằng tiếng việt) về nội dung, đưa ra lỗi sai phát âm (nếu có) và thứ 3 là hoàn thiện bài speaking trên (bằng tiếng anh) tốt hơn`;

  const audioPart = fileToGenerativePart(req.file.path, "audio/mp3");

  try {
    const result = await model.generateContent([prompt, audioPart]);
    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);
    res.json(jsonResponse);
    console.log(jsonResponse)
  } catch (error) {
    console.error("Lỗi xử lý AI:", error);
    res.status(500).json({ error: "AI processing failed" });
  } finally {
    fs.unlinkSync(req.file.path); // Xóa file tạm sau khi xử lý
  }
});

app.post("/evaluate-text", async(req, res) => {
    const topic = "Describe a difficult decision you had to make";
    const prompt = `Tôi có 1 bài writing về chủ đề \"${topic}\". Hãy giúp tôi 3 việc sau: đầu tiên là chấm điểm, thứ 2 là nhận xét (bằng tiếng việt) về nội dung, đưa ra lỗi sai ngữ pháp (nếu có) và thứ 3 là hoàn thiện bài writing trên (bằng tiếng anh) tốt hơn. Dưới đây là nội dung bài viết: ${req.body.text}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);
    res.json(jsonResponse);
    console.log(jsonResponse)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
