import { type Request, type Response } from 'express';
import bcrypt, { compare } from "bcryptjs"
import prismadb from "../lib/prismadb"

import { sendToken, uploadFilesToCloudinary, cookieOptions } from '../utils/feature';
import { CustomError } from '../middleware/error';

export const register = async (req: Request, res: Response) => {
    const { name, username, password, bio, email } = req.body;
    const file = req.file as Express.Multer.File;

    try {

        if (req.file === undefined || null) {
            throw new CustomError("Please Upload Avatar", 404);
        }

        const result: { public_id: string; url: string }[] | undefined = await uploadFilesToCloudinary([file]);

        if (!result) {
            throw new CustomError("Something went wrong", 400);
        }

        // const avatar = {
        //     public_id: result[0].public_id,
        //     url: result[0].url,
        // };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismadb.user.create({
            data: {
                name, username, password: hashedPassword, bio, email, avatar: result[0].url,
            }
        })
        const { password: dbPassword, ...rest } = user
        sendToken(res, rest, 201, "User created");
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await prismadb.user.findFirst({
        where: {
            username
        }
    });

    if (!user) {
        throw new CustomError("Invalid Username or Password", 404)
    };

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
        throw new CustomError("Invalid Username or Password", 404);
    }

    const { password: dbPassword, ...rest } = user

    sendToken(res, rest, 200, `Welcome Back, ${user.name}`);
}

export const logout = async (req: Request, res: Response) => {
    return res
        .status(200)
        .cookie("cookie", "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out successfully",
        });
}