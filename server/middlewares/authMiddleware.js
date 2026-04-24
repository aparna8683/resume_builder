import jwt from "jsonwebtoken";
const protect=async (req,res, next)=>{
    const authHeaders= req.headers.authorization;
    if(!authHeaders){
        return res.status(401).json({message:"Unauthorized"
        })
    } 

    try{ 
        const token = authHeaders.startsWith("Bearer ")
        ? authHeaders.split(" ")[1]:
        authHeaders;
        const decoded= jwt.verify(token, process.env.JWT_SECRET) ;
        req.userId=decoded.userId
        next();        
    } catch(error){
        return res.status(401).json({message:"Unauthorized"})

    }
}
export default protect;