import { Response } from 'express';
import jwt from "jsonwebtoken";

import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from '../lib/helper';
import { CustomError } from '../middleware/error';

export const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none" as const, // Adjusted type to string literal
    httpOnly: true,
    secure: true,
};

export const sendToken = (res: Response, user: { id: string }, code: number, message: string) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    console.log(token)

    return res.status(code).cookie("cookie", token, cookieOptions).json({
        success: true,
        user,
        message,
    });
};

export const uploadFilesToCloudinary = async (files: Express.Multer.File[] = []): Promise<{public_id: string;url: string;}[] | undefined> => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result: any) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (err: any) {
        console.log("Error uploading files to cloudinary", err);
    }
};
