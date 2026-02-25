import Resume from "../Models/resume.js";
import ai from "../configs/ai.js";
export const enhanceProfessionalSummary= async(req, res)=>{
    try{ 
        const {userContent}= req.body;
        if(!userContent){
            return res.status(400).json({message:'Missing required fields'})
        }
      const response=  await ai.openai.chat.completions.create({
            model:process.env.OPENAI_MODEL ,
            messages: [
        { role: "system", content:             "You are a professional resume writer. Enhance the summary to be impactful, concise (3-4 sentences), and ATS-friendly.",
 },
        {
            role: "user",
            content: userContent,
        },
    ],            
        })
        const enhancedContent=response.choices?.[0]?.message?.content || "";
        return res.status(200).json({enhancedContent})
    } 
    catch(error){
        return res.status(500).json({message:error.message})

    }
}
// console.log(response.choice[0].message)
// controller for enahnceing resume job description
export const enhanceJobDescription= async(req, res)=>{
    try{ 
        const {userContent}= req.body;
        if(!userContent){
            return res.status(400).json({message:'Missing required fields'})
        }
      const response=  await ai.openai.chat.completions.create({
            model:process.env.OPENAI_MODEL ,
            messages: [
        { role: "system", content:"You are a resume expert. Improve the job description to be achievement-focused, quantified, and ATS-friendly.",
 },
        {
            role: "user",
            content: userContent,
        },
    ],            
        })
         const enhancedContent=response.choices?.[0]?.message?.content ||"";
        return res.status(200).json({enhancedContent})
    } 
    catch(error){
        return res.status(500).json({message:error.message})

    }
}
// controller for uploading resume to the database
export const uploadResume= async(req, res)=>{
    try{ 
        const {resumeText, title}= req.body;
        const userId= req.userId;
        if(!resumeText || !title){
                    return res.status(400).json({message:'Missing required fields'})

        }
        const systemPrompt="You are an expert AI agent to extract data from resume"
        const userPrompt = `
Extract structured data from the resume below.

Return ONLY valid JSON in this exact structure:

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

Resume Text:
${resumeText}
`;
        const response=  await ai.openai.chat.completions.create({
            model:process.env.OPENAI_MODEL ,
            messages: [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: userPrompt,
        },
    ], 
     response_format:{type: 'json_object'}            
        })
        const extractedData=response.choices?.[0]?.message?.content;
        let parsedData
        try{
         parsedData= JSON.parse(extractedData)

        } 
        catch (err) {
      return res
        .status(500)
        .json({ message: "AI response parsing failed" });
    }

        const newResume= await Resume.create({userId, title, ...parsedData})
return res.status(201).json({
      resumeId: newResume._id,
    });    } 
    catch(error){
        return res.status(400).json({message:error.message})

    }
}

