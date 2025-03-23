// Test AI

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as fs from 'node:fs';
import 'dotenv/config'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// -------------------------------------------------------------------
// Generate text from text-only input
// const prompt = "Kể tên 10 loài hoa đẹp nhất thế giới";
// const result = await model.generateContent(prompt);
// console.log(result.response.text());

// -------------------------------------------------------------------
// Generate text from text-and-image input
// function fileToGenerativePart(path, mimeType) {
//     return {
//         inlineData: {
//             data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//             mimeType,
//         },
//     };
// }
// const prompt = "Miêu tả bức ảnh này"
// const imagePart = fileToGenerativePart("file-temp/vXr0jGq.jpeg", "image/png");
// const result = await model.generateContent([prompt, imagePart]);
// console.log(result.response.text());

// -------------------------------------------------------------------
// Generate output Schema

const schema = {
    type: SchemaType.OBJECT,
    properties: {
        score: {
            type: SchemaType.STRING,
            nullable: false,
        },
        comment: {
            type: SchemaType.STRING,
            nullable: false,
        },
        suggest: {
            type: SchemaType.STRING,
            nullable: false,
        },
    },
    // required: ["recipeName"],
};

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", generationConfig: {
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

const topic = 'Describe a difficult decision you had to make'
const prompt = `Tôi có 1 file speaking sau về chủ đề "${topic}". Hãy giúp tôi chấm điểm, nhận xét (bằng tiếng việt) về nội dung  
đưa ra lỗi sai phát âm (nếu có) và hoàn thiện bài speaking trên (bằng tiếng anh) tốt hơn`
const imagePart = fileToGenerativePart("file-temp/ielts_speaking_sample.mp3", "audio/mp3");

const result = await model.generateContent([prompt, imagePart]);
const responseText = result.response.text();
try {
    const jsonResponse = JSON.parse(responseText);
    console.log(jsonResponse); //in ra toàn bộ json để kiểm tra cấu trúc.
    console.log('score:', jsonResponse.score);
    console.log('comment:', jsonResponse.comment);
    console.log('suggest:', jsonResponse.suggest);
} catch (error) {
    console.error("Lỗi phân tích cú pháp JSON:", error);
    console.log("Phản hồi từ API:", responseText);
}