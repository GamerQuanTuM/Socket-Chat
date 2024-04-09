import express from "express";
import { getIndividualUserChats,getMessagesBetweenTwoUsers } from "../controllers/chat.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router()

router.post("/get-user-chats", isAuthenticated, getIndividualUserChats)
router.post("/get-user-messages",isAuthenticated, getMessagesBetweenTwoUsers)

export default router

