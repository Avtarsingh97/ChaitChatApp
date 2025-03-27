const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const app = express();

// Middleware
app.use(cors({
    origin: [BASE_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: [BASE_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    transports: ["websocket", "polling"],
});

// Database Connection
require("./Database/connection");

// Routes
const UserRoutes = require("./Routes/user");
const ConversationRoutes = require("./Routes/conversation");
const MessageRoutes = require("./Routes/message");

app.use("/api/auth", UserRoutes);
app.use("/api/conversation", ConversationRoutes);
app.use("/api/chat", MessageRoutes);

// Socket.IO Connection Logic
io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("joinConversation", (conversationId) => {
        console.log(`User joined Conversation ID: ${conversationId}`);
        socket.join(conversationId);
    });

    socket.on("sendMessage", (convId, messageDetail) => {
        console.log("Message Sent");
        io.to(convId).emit("receiveMessage", messageDetail);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});

// Default Route
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", BASE_URL);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    return res.status(200).json({ message: "Server started" });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});

// Server Shutdown Handling
process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});
