require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./infrastructure/database/mongoose");
const userRoute = require("./interfaces/routes/userRoute");
const adminRoute = require("./interfaces/routes/adminRoute");
const airlineRoute = require("./interfaces/routes/airlineRoute");
const Conversation = require("./infrastructure/repositaries/messageRepositary");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

connectDB();
app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/airline", airlineRoute);

const connectedUsers = new Map();

io.on("connection", async (socket) => {
  // console.log("new client connected", socket);

  socket.on("join", (userId) => {
    console.log("User joined:", userId);
    connectedUsers.set(socket.id, userId);
    socket.join(userId);
  });

  socket.on("sendMessage", async (messageData) => {
    try {
      const { senderId, receiverId, text } = messageData;
      console.log("Message received:", messageData);

      let conversation = await Conversation.findOne({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      });
      if (!conversation) {
        conversation = new Conversation({
          sender: senderId,
          receiver: receiverId,
          messages: [],
        });
      }

      const newMessage = {
        text,
        sender: senderId,
        timestamp: new Date(),
      };

      conversation.messages.push(newMessage);
      await conversation.save();

      io.to(senderId).emit("messageReceived", newMessage);
      io.to(receiverId).emit("messageReceived", newMessage);

      console.log("Message sent to rooms:", senderId, receiverId);
    } catch (error) {
      console.error("Error occured: ", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    connectedUsers.delete(socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
