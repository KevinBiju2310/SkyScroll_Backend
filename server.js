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
const Notification = require("./infrastructure/repositaries/notificationRepositary");

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
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
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
const onlineUsers = new Set();

io.on("connection", async (socket) => {
  // console.log("new client connected", socket);

  socket.on("join", (userId) => {
    console.log("User joined:", userId);
    connectedUsers.set(socket.id, userId);
    onlineUsers.add(userId);
    socket.join(userId);
    io.emit("userOnline", userId);
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

      const notification = new Notification({
        recipient: receiverId,
        sender: senderId,
        type: "MESSAGE",
        content: text.length > 50 ? `${text.substring(0, 50)}...` : text,
        conversationId: conversation._id,
      });
      await notification.save();

      io.to(senderId).emit("messageReceived", newMessage);
      io.to(receiverId).emit("messageReceived", newMessage);
      io.to(receiverId).emit("newNotification", {
        notificationId: notification._id,
        type: "MESSAGE",
        content: notification.content,
        sender: senderId,
        timestamp: notification.createdAt,
      });

      console.log("Message sent to rooms:", senderId, receiverId);
    } catch (error) {
      console.error("Error occured: ", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  socket.on("markNotificationAsRead", async ({ notificationId }) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );

      if (notification) {
        io.to(notification.recipient.toString()).emit(
          "notificationRead",
          notificationId
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  });

  socket.on("getUnreadNotifications", async (userId) => {
    try {
      const unreadNotifications = await Notification.find({
        recipient: userId,
        read: false,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      socket.emit("unreadNotifications", unreadNotifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  });

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      const conversation = await Conversation.findOne({
        $or: [
          { sender: conversationId, receiver: userId },
          { sender: userId, receiver: conversationId },
        ],
      });

      if (conversation) {
        await Conversation.updateOne(
          {
            _id: conversation._id,
            "messages.sender": conversationId,
            "messages.seen": false,
          },
          {
            $set: {
              "messages.$[elem].seen": true,
            },
          },
          {
            arrayFilters: [
              { "elem.sender": conversationId, "elem.seen": false },
            ],
            multi: true,
          }
        );

        await Notification.updateMany(
          {
            recipient: userId,
            sender: conversationId,
            conversationId: conversation._id,
            read: false,
          },
          { read: true }
        );

        io.to(conversationId).emit("messagesSeen", { by: userId });
        io.to(userId).emit("notificationsCleared", { conversationId });
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  socket.on("disconnect", () => {
    const userId = connectedUsers.get(socket.id);
    console.log("Client disconnected:", socket.id);
    connectedUsers.delete(socket.id);

    let userOtherConnections = false;
    connectedUsers.forEach((id) => {
      if (id === userId) {
        userOtherConnections = true;
      }
    });

    if (!userOtherConnections) {
      onlineUsers.delete(userId);
      io.emit("userOffline", userId);
    }
  });

  socket.on("checkOnlineStatus", (userId) => {
    socket.emit("onlineStatus", {
      userId,
      isOnline: onlineUsers.has(userId),
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
