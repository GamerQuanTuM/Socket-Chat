import { type Request, type Response } from "express"

import prismadb from "../lib/prismadb"
import { CustomError } from "../middleware/error"

export const getIndividualUserChats = async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body
    try {

        if (!userId) {
            throw new CustomError("Not authenticated", 401)
        }

        const chats = await prismadb.chat.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ]
            },
            include: {
                receiver: true,
                sender: true
            }
        })

        return res.status(200).json({ message: chats })

    } catch (error) {
        return res.status(200).json({ message: error })
    }
}

export const getMessagesBetweenTwoUsers = async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.body
    try {
        const messages = await prismadb.chat.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { senderId: senderId, receiverId: receiverId },
                            { senderId: receiverId, receiverId: senderId },
                        ],
                    },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        return res.status(200).json({ message: messages })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}