import bcrypt from 'bcrypt';
import { Request } from 'express';
import {BaseQueryT, ErrorsForControllers, HTTP_STATUSES, ValidationErrors} from "./config/baseTypes";

export const setDefaultQueryParams = ({ pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortDirection = 'desc'}: BaseQueryT) => ({
    pageSize: Math.abs(+pageSize),
    pageNumber: Math.abs(+pageNumber),
    sortBy,
    sortDirection
});

export const isEmail = (email: string | undefined | null) => {
    if (typeof email !== 'string') return false;
    return !!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
}
export const isLogin = (login: string | undefined | null) => {
    if (typeof login !== 'string') return false;
    return !!login.match(/^[a-zA-Z0-9_-]*$/g);
};

export const checkMongooseErrorsOnDuplicateKey = (error: Error): ValidationErrors | string => {
    const errorsArr = error.message.match(/\{\s*\w+:\s*"\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+"\s*}|\{\s*\w+:\s*"\w*\.*\w*"\s*}/g);
    if (errorsArr && errorsArr.length > 0) {
        const [field, value] = errorsArr[0].replace(/\s+|"|{|}|'/g, '').split(':')
        return {
            errorsMessages: [
                {
                    message: `Field ${field} with ${value} already exist`,
                    field,
                }
            ]
        }
    }
    return error.message;
}

export const comparePasswords = (password: string, hash: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

export const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

export const getUserIp = (req: Request) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!ip) return 'none';
    return Array.isArray(ip) ? ip[0] : ip;
};

export const errorGenerator = {
    badRequest(msg: string, field: string) {
        return {
            errorCode: HTTP_STATUSES.BAD_REQUEST_400,
            errorMessage: {
                errorsMessages: [
                    { message: msg, field: field }
                ]
            }
        } as ErrorsForControllers
    },
    notAuthorized(msg: string, field: string) {
        return {
            errorCode: HTTP_STATUSES.NOT_AUTHORIZED_401,
            errorMessage: {
                errorsMessages: [
                    { message: msg, field: field }
                ]
            }
        } as ErrorsForControllers
    }
}