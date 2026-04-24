// import Resume from "../Models/resume.js";
// import ai from "../configs/ai.js";
// export const enhanceProfessionalSummary= async(req, res)=>{
//     try{ 
//         const {userContent}= req.body;
//         if(!userContent){
//             return res.status(400).json({message:'Missing required fields'})
//         }
//       const response=  await ai.chat.completions.create({
//             model:process.env.OPENAI_MODEL ,
//             messages: [
//         { role: "system", content:             "You are a professional resume writer. Enhance the summary to be impactful, concise (3-4 sentences), and ATS-friendly.",
//  },
//         {
//             role: "user",
//             content: userContent,
//         },
//     ],            
//         })
//         const enhancedContent=response.choices?.[0]?.message?.content || "";
//         return res.status(200).json({enhancedContent})
//     } 
//     catch(error){
//         return res.status(500).json({message:error.message})

//     }
// }
// // console.log(response.choice[0].message)
// // controller for enahnceing resume job description
// export const enhanceJobDescription= async(req, res)=>{
//     try{ 
//         const {userContent}= req.body;
//         if(!userContent){
//             return res.status(400).json({message:'Missing required fields'})
//         }
//       const response=  await ai.chat.completions.create({
//             model:process.env.OPENAI_MODEL ,
//             messages: [
//         { role: "system", content:"You are a resume expert. Improve the job description to be achievement-focused, quantified, and ATS-friendly.",
//  },
//         {
//             role: "user",
//             content: userContent,
//         },
//     ],            
//         })
//          const enhancedContent=response.choices?.[0]?.message?.content ||"";
//         return res.status(200).json({enhancedContent})
//     } 
//     catch(error){
//         return res.status(500).json({message:error.message})

//     }
// }
// // controller for uploading resume to the database
// // export const uploadResume= async(req, res)=>{
// //     try{ 
// //         const {resumeText, title}= req.body;
// //         const userId= req.userId;
// //         console.log("uploadResume hit");
// //     console.log("title:", title);
// //     console.log("resumeText exists:", !!resumeText);
// //     console.log("resumeText length:", resumeText?.length);
// //     console.log("userId:", userId);
// //         if(!resumeText || !title){
// //                     return res.status(400).json({message:'Missing required fields'})

// //         }
// //         const systemPrompt="You are an expert AI agent to extract data from resume"
// //         const userPrompt = `
// // Extract structured data from the resume below.

// // Return ONLY valid JSON in this exact structure:

// // {
// //   "professional_summary": "",
// //   "skills": [],
// //   "personal_info": {
// //     "image": "",
// //     "full_name": "",
// //     "profession": "",
// //     "email": "",
// //     "location": "",
// //     "linkedin": "",
// //     "website": ""
// //   },
// //   "experience": [
// //     {
// //       "company": "",
// //       "position": "",
// //       "start_date": "",
// //       "end_date": "",
// //       "description": "",
// //       "is_current": false
// //     }
// //   ],
// //   "project": [
// //     {
// //       "name": "",
// //       "type": "",
// //       "description": ""
// //     }
// //   ],
// //   "education": [
// //     {
// //       "institution": "",
// //       "degree": "",
// //       "field": "",
// //       "gpa": "",
// //       "graduation_date": ""
// //     }
// //   ]
// // }

// // Resume Text:
// // ${resumeText}
// // `;
// //         const response=  await ai.chat.completions.create({
// //             model:process.env.OPENAI_MODEL ,
// //             messages: [
// //         { role: "system", content: systemPrompt },
// //         {
// //             role: "user",
// //             content: userPrompt,
// //         },
// //     ], 
// //      response_format:{type: 'json_object'}            
// //         })
// //         const extractedData=response.choices?.[0]?.message?.content;
// //         let parsedData
// //         try{
// //          parsedData= JSON.parse(extractedData)

// //         } 
// //         catch (err) {
// //       return res
// //         .status(500)
// //         .json({ message: "AI response parsing failed" });
// //     }

// //         const newResume= await Resume.create({userId, title, ...parsedData})
// // return res.status(201).json({
// //       resumeId: newResume._id,
// //     });    } 
// //     catch(error){
// //           console.error("uploadResume error:", error);

// //         return res.status(500).json({    message: error.message || "Resume upload failed",
// // })

// //     }
// // }

// export const uploadResume = async (req, res) => {
//   try {
//     const { resumeText, title } = req.body;
//     const userId = req.userId;
//     console.log("MODEL:", process.env.OPENAI_MODEL);
// console.log("BASE URL:", process.env.OPENAI_BASE_URL);
// console.log("API KEY exists:", !!process.env.GEMINI_API_KEY);

//     console.log("uploadResume hit");
//     console.log("title:", title);
//     console.log("resumeText exists:", !!resumeText);
//     console.log("resumeText length:", resumeText?.length);
//     console.log("userId:", userId);

//     if (!resumeText || !title) {
//       console.log("Returning 400: missing fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     console.log("Calling AI...");

//     const response = await ai.chat.completions.create({
//       model: process.env.OPENAI_MODEL,
//       messages: [
//         { role: "system", content: "You are an expert AI agent to extract data from resume." },
//         { role: "user", content: resumeText }
//       ]
//     });

//     console.log("AI response received");

//     const extractedData = response.choices?.[0]?.message?.content;
//     console.log("AI content:", extractedData);

//     const parsedData = JSON.parse(extractedData);

//     const newResume = await Resume.create({
//       userId,
//       title,
//       ...parsedData,
//     });

//     console.log("Resume created:", newResume._id);

//     return res.status(201).json({ newResume });
//   } catch (error) {
//     console.error("uploadResume error:", error);
//     return res.status(500).json({
//       message: error.message || "Resume upload failed",
//     });
//   }
// };
import Resume from "../Models/resume.js";
import ai from "../configs/ai.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:`
            You are a professional resume writer.

Your task is to rewrite the user's professional summary.
Rules:
- Return ONLY the improved professional summary.
- Do NOT ask questions.
- Do NOT give tips, frameworks, explanations, bullet points, or headings.
- Keep it ATS-friendly.
- Keep it concise: 3 to 4 sentences maximum.
- Use strong, polished, professional language.
- If the input is very short or weak, still rewrite it into the best possible summary using only the given information.
`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices?.[0]?.message?.content || "";
    

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("enhanceProfessionalSummary error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a resume expert. Improve the job description to be achievement-focused, quantified, and ATS-friendly.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices?.[0]?.message?.content || "";

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("enhanceJobDescription error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt = `
You are a resume data extraction engine.

Return ONLY valid raw JSON.
Do not return markdown.
Do not return bullet points.
Do not return headings.
Do not return bold text.
Do not return explanations.
Do not wrap the response in backticks.

Your output must be directly parseable by JSON.parse().
`;

    const userPrompt = `
Extract structured data from the resume below.

Return ONLY valid JSON in exactly this structure:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "gpa": "",
      "graduation_date": ""
    }
  ]
}

Rules:
- If data is missing, use "" or [].
- Output must start with { and end with }.
- Do not add any text before or after the JSON.

Resume Text:
${resumeText}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    let extractedData = response.choices?.[0]?.message?.content || "";

    extractedData = extractedData
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!extractedData.startsWith("{") || !extractedData.endsWith("}")) {
      console.error("Raw AI content:", extractedData);
      return res.status(500).json({
        message: "AI did not return valid JSON",
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (err) {
      console.error("JSON parse error:", err);
      console.error("Raw AI content:", extractedData);
      return res.status(500).json({
        message: "AI response parsing failed",
      });
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.status(201).json({ newResume });
  } catch (error) {
    console.error("uploadResume error:", error);
    const statusCode = error?.status || 500;
    const message =
      statusCode >= 500
        ? "AI service temporarily unavailable. Please try again."
        : error.message || "Resume upload failed";
    return res.status(500).json({
      message,
    });
  }
};