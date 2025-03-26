const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

// env variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

const _dirname = path.resolve();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin : process.env.BASE_URL || "*",
        credentials : true
    }
})

require('./Database/connection');

//Middleware
app.use(cors({
    origin : process.env.BASE_URL || "*",
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());

//Routes
const UserRoutes = require('./Routes/user');
const ConversationRoutes = require("./Routes/conversation")
const MessageRoutes = require("./Routes/message");


app.use('/api/auth',UserRoutes);
app.use('/api/conversation', ConversationRoutes);
app.use('/api/chat', MessageRoutes);


// Socket.IO Connection Logic
io.on('connection',(socket)=>{
    console.log('User Connected');

    socket.on('joinConversation',(conversationId)=>{
        console.log(`User joined Conversation ID of ${conversationId}`)
        socket.join(conversationId)
    })

    socket.on('sendMessage',(convId, messageDetail)=>{
        console.log('Message Sent')
        io.to(convId).emit('receiveMessage',messageDetail)
    })

    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    })
})


app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get('*',(req,res) =>{
    res.sendFile(path.resolve(_dirname,"frontend", "dist", "index.html"));
})

// Start Server
server.listen(PORT,()=>{
    console.log("Backend project is running on port number ", PORT)
})

// Server Shutdown
process.on('SIGINT', () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});