import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors"
import { createServer } from "http";


import { corsOptions } from "./constants/config";
import { errorHandler } from "./middleware/error";
import authRouter from "./routes/auth"
import chatRouter from "./routes/chat"
import userRouter from "./routes/user"
import { saveMessageToDb } from "./sockets/chat.socket";
import { CHAT_MESSAGE, CONNECT, DISCONNECT, JOIN_ROOM, RECEIVE_MESSAGE, USER_JOINED, USER_TYPING, USER_TYPING_STATUS } from "./constants/events";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app: Express = express();
const port = process.env.PORT as string || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/user", userRouter)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

function generateRoomId(userId1: string, userId2: string) {
  // Sort the user IDs to ensure consistency in generating the room ID
  const sortedIds = [userId1, userId2].sort();
  return sortedIds.join("_");
}

io.on(CONNECT, (socket) => {
  console.log('A client connected', socket.id);

  socket.on(DISCONNECT, () => {
    console.log('A client disconnected');
  });

  socket.on(JOIN_ROOM, ({ senderId, receiverId }) => {
    const roomId = generateRoomId(senderId, receiverId); // Generate a unique room ID
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    io.emit(USER_JOINED, roomId)
  });

  socket.on(CHAT_MESSAGE, async (data) => {
    const message = await saveMessageToDb(data);
    const roomId = generateRoomId(data.senderId, data.receiverId); // Generate the room ID based on sender and receiver IDs
    io.to(roomId).emit(RECEIVE_MESSAGE, message);
  });

  socket.on(USER_TYPING, ({ roomId, isTyping }) => {
    console.log(`Socket ${socket.id} is typing: ${isTyping}`);
    socket.broadcast.to(roomId).emit(USER_TYPING_STATUS, { isTyping });
  });
});

app.use(errorHandler);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});