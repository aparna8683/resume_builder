import Resume from "../Models/resume.js";
import ai from "../configs/ai.js";


export const enhanceProfessionalSummary= async(req, res)=>{
    try{ 
        const {userContent}= req.body;
        if(!userContent){
            return res.status(400).json({message:'Misiing required fields'})
        }
      const response=  await ai.openai.chat.completions.create({
            model:process.env.OPENAI_MODEL ,
            messages: [
        { role: "system", content: "You are a helpful assistant.Enhance the professional summary" },
        {
            role: "user",
            content: userContent,
        },
    ],            
        })
        const enhancedContent=response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } 
    catch(error){
        return res.status(400).json({message:error.message})

    }
}
// console.log(response.choice[0].message)
// controller for enahnceing resume job description
export const enhanceJobDescription= async(req, res)=>{
    try{ 
        const {userContent}= req.body;
        if(!userContent){
            return res.status(400).json({message:'Misiing required fields'})
        }
      const response=  await ai.openai.chat.completions.create({
            model:process.env.OPENAI_MODEL ,
            messages: [
        { role: "system", content: "You are a helpful assistant. Enhance the Job Description  summary for a resume .Also make it ATS friendly " },
        {
            role: "user",
            content: userContent,
        },
    ],            
        })
        const enhancedContent=response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } 
    catch(error){
        return res.status(400).json({message:error.message})

    }
}
// controller for uploading resume to the database
export const uploadResume= async(req, res)=>{
    try{ 
        const {resumeText, title}= req.body;
        const userId= req.userId;
        if(!resumeText){
                    return res.status(400).json({message:'Missing required fields'})

        }
        const systemPrompt="You are an expert AI agent to extract data from resume"
        const userPrompt= `extract data from resume;${resumeText}
        Provide data in the following JSON format with no additional text before or afetr:
        professional_summary:{type:String, default:''},
    skills:[{
        type:String
    }],
    personal_info:{
        image:{type:String, default:''},
        full_name:{type:String, default:''},
        profession:{type:String, default:''},
        email:{type:String, default:''},
        location:{type:String, default:''},
        linkedin:{type:String, default:''},
        website:{type:String, default:''},
    },
    experience:[{
        company:{type:String},
        position:{type:String},
        start_date:{type:String},
        end_date:{type:String},
        description:{type:String},
        is_current:{type:Boolean}


    }],
    project:[
        {
            name:{type:String},
        type:{type:String},
        description:{type:String},
        }
    ],
    education:[{
        institution:{type:String},
        degree:{type:String},
        field:{type:String},
        Gpa:{type:String},
        graduation_date:{type:String}


    }],


        `
        
      const response=  await ai.openai.chat.completions.create({
            model:process.env.OPENAI_MODEL ,
            messages: [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: userPrompt,
        },
    ], 
     respinse_format:{type: 'json_object'}            
        })
        const extractedData=response.choices[0].message.content;
        const parsedData= JSON.parse(extractedData)
        const newResume= await Resume.create({userId, title, ...parsedData})
         res.json({resumeId:newResume._id})
    } 
    catch(error){
        return res.status(400).json({message:error.message})

    }
}

