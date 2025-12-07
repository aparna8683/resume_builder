import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL:process.env.OPENAI_BASE_URL,
});

// const response = await openai.chat.completions.create({
//     model: "gemini-2.0-flash",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Explain to me how AI works",
//         },
//     ],
// });

// console.log(response.choices[0].message);
export default ai