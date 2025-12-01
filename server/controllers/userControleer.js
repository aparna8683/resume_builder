import Resume from "../Models/resume.js";
import User from "../Models/User.js";
import jwt from 'jsonwebtoken'
//genbertae token
const generateToken=(userId)=>{
    const token= jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:'7d'})
    return token;

    
}

//Controller for User Registration
export const registeredUser=async(req, res)=>{
    try{
        const{name, email,password} = req.body;
        if(!name || !email ||!password){
            return res.status(400).json({message:'Missing required fields'})

        }
        const user=await User.findOne({email})
            if(user)
            {
                 return res.status(400).json({message:"User already Exist"})
            }
            //create new User
            const hashedPassword= await bcrypt.hash(password, 10)
            const newUser= await User.create({
                name, email, password:hashedPassword
            })
            // return success message
            const token=generateToken(newUser._id)
            newUser.password =undefined;
            return res.status(201).json({message:'User created successfully', token, user:newUser})
        
    }
    catch(error){
         return res.status(400).json({message:error.message})
    }
}
/// controller for userLogin
export const loginUser= async (req, res)=>{
    try{
    const {email,password}=req.body;
       const user=User.findOne({email})
       if(!user){
        return res.status(400).json({message:"Invalid email or password"})
       }
       // check if password is correct
       if(!user.comparePassword(password)){
        return res.status(400).json({message:"Inva;id password"})
       }
       //return success message
       const token= generateToken(user._id)
        user.password=undefined
       return res.status(201).json({message:"User logged in successfullt",token, user})
    
    }
    catch(error){

        return res.status(400).json({message:error.message})
    }

    



}
// controller for getting user by Id
export const getUserById= async (req, res)=>{
    try{   

        const userId=req.userId
          // check if user Exists
          const user= await User.findById(userId)
          if(!user){
            return res.status(404).json({message:"User not found"})
          }
          // return user
          user.password=undefined
          return res.status(200).json({user})


    }
catch(error){
    return res.status(400).json({message:error.message})

}


}
// getting user resume
export const getUserResume=async (req, res)=>{
    try{ 
        const userId= req.userId;
        // return user resumes
        const resumes= await Resume.find({userId})
        return res.status(200).json({resumes})

    }catch(error){
        return res.status(400).json({
            message:error.message
        })
    }
}