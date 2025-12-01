import express from 'express'
import cors from 'cors'
import "dotenv/config"
const app= express()
const PORT=process.env.PORT|| 3000;
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
app.use(express.json())
app.use(cors());
app.get("/",(req,res)=>{

    res.send("Helloo Server is Live")
})
app.use('/api/users', userRouter)

app.listen(PORT, ()=>{
    console.log("Hello Server is running on port", PORT)
})
await connectDB()

