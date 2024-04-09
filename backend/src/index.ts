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
import { saveMessageToDb, getMessagesBetweenTwoUsers } from "./sockets/chat.socket";

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

io.on('connection', (socket) => {
  console.log('A client connected', socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });

  socket.on("chat message", async (data: { message: string, userId: string, interactingUserId: string }) => {
    const message = await saveMessageToDb(data)
    io.emit("receive message", message)
  })


  socket.on('join-room', async (roomId) => {
    socket.join(roomId)
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('user-typing', ({ roomId, isTyping }) => {
    console.log(`Socket ${socket.id} is typing: ${isTyping}`);
    socket.broadcast.to(roomId).emit('user-typing-status', { isTyping });
  });
});

app.use(errorHandler);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});