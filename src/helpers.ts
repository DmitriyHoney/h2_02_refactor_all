import bcrypt from 'bcrypt';
import {BaseQueryT} from "./config/baseTypes";
export const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

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