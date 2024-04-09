import { type Request, type Response, type NextFunction } from 'express';
import jwt from "jsonwebtoken"
import { Socket } from 'socket.io';

import { CustomError } from './error';
import { COOKIE_TOKEN } from '../constants/config';


declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
        }
    }
}


export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = req.cookies[COOKIE_TOKEN];
        if (!token)
            return next(new CustomError("Please login to access this route", 401));

        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        req.user = decodedData.id;
        next();
    } catch (error) {
        res.status(401).json(error);
    }
}


