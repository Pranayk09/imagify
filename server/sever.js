import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';


const app = express();

app.use(express.json());
app.use(cors());
await connectDB();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.get('/', (req,res)=>{ res.send("API is Working")});



const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log("Server is running on port", +PORT);
})




