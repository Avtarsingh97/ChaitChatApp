const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const dotenv = require('dotenv');


// env variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",  // Local Frontend
            "https://chait-chat-app-frontend.vercel.app"  // Deployed Frontend
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    transports: ["websocket", "polling"]  // Allow both WebSockets & Polling
});

require('./Database/connection');

//Middleware
app.use(cors({
    origin : [
    "http://localhost:5173",
    "https://chait-chat-app-frontend.vercel.app"
],
    methods: ["GET", "POST", "PUT", "DELETE"],
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

// Default Route
app.use("/", (req,res)=>{
    res.status(200).json({message : "Server started"})
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
