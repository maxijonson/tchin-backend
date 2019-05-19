import { NextFunction, Request, Response } from "express";
import moment from "moment";

export const useReqLogging = (format?: string) => (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    console.info(
        `${moment().format(format || "H:mm:ss")}: ${req.method} ${req.url}`
    );
    next();
};
