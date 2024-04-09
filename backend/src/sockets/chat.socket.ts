import { CustomError } from "../middleware/error"
import prismadb from "../lib/prismadb"

export const saveMessageToDb = async (data: { message: string, senderId: string, receiverId: string }) => {
    console.log(data)
    try {
        if (!data) {
            return
        }
        const saveChats = await prismadb.chat.create({
            data: {
                message: data.message,
                senderId: data.senderId,
                receiverId: data.receiverId
            }
        })

        return saveChats
    } catch (error) {
        console.log(error)
        throw new CustomError("Something went wrong", 500)
    }
}

export const getMessagesBetweenTwoUsers = async (senderId: string, receiverId: string) => {
    try {
        if (!senderId || !receiverId) {
            return
        }
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
        return messages
    } catch (error) {
        console.log(error)
        throw new CustomError("Something went wrong", 500)
    }
}