import express from 'express';
import { createServer } from 'node:http';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from './routes/userRoutes.js'

const app = express();
const server = createServer(app);
const io = connectToSocket(server)

app.set('port',(process.env.PORT  || 8000)) ;
app.use(cors());
app.use(express.json({limit:'40kb'}));
app.use(express.urlencoded({limit: "40kb" , extended:true}))
app.use('/api/v1/users',userRoutes)
app.get("/home",(req,res)=>{
    res.send("hello")
});

const start = async ()=>{
    app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://rajkumarmohanty949:CziuOf59FxnLUNjM@cluster0.czm2m.mongodb.net/VideoCall")
    console.log(`mongodb connected to host : ${connectionDb.connection.host}`);
    
    server.listen(app.get('port'),()=>{
        console.log("Listening on port 8000");
    })
}
start();