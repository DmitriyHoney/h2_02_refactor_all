import bcrypt from 'bcrypt';
import {BaseQueryT, ValidationErrors} from "./config/baseTypes";

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
    const errorsArr = error.message.match(/{ \w+: "\w*\@*\w*\.*\w*" }/g);
    console.log(errorsArr);
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