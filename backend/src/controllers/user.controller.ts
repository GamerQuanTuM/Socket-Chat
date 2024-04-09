import { type Request, type Response } from "express"

import prismadb from "../lib/prismadb"

export const getUserDetails = async (req: Request, res: Response) => {
    const { id }: { id: string } = req.body
    try {

        if (!id) {
            return;
        }

        const user = await prismadb.user.findFirst({
            where: {
                id
            }
        })
        return res.status(200).json({ message: user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
}