"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorGenerator = exports.getUserIp = exports.hashPassword = exports.comparePasswords = exports.checkMongooseErrorsOnDuplicateKey = exports.isLogin = exports.isEmail = exports.setDefaultQueryParams = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const baseTypes_1 = require("./config/baseTypes");
const setDefaultQueryParams = ({ pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortDirection = 'desc' }) => ({
    pageSize: Math.abs(+pageSize),
    pageNumber: Math.abs(+pageNumber),
    sortBy,
    sortDirection
});
exports.setDefaultQueryParams = setDefaultQueryParams;
const isEmail = (email) => {
    if (typeof email !== 'string')
        return false;
    return !!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
};
exports.isEmail = isEmail;
const isLogin = (login) => {
    if (typeof login !== 'string')
        return false;
    return !!login.match(/^[a-zA-Z0-9_-]*$/g);
};
exports.isLogin = isLogin;
const checkMongooseErrorsOnDuplicateKey = (error) => {
    const errorsArr = error.message.match(/\{\s*\w+:\s*"\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+"\s*}|\{\s*\w+:\s*"\w*\.*\w*"\s*}/g);
    if (errorsArr && errorsArr.length > 0) {
        const [field, value] = errorsArr[0].replace(/\s+|"|{|}|'/g, '').split(':');
        return {
            errorsMessages: [
                {
                    message: `Field ${field} with ${value} already exist`,
                    field,
                }
            ]
        };
    }
    return error.message;
};
exports.checkMongooseErrorsOnDuplicateKey = checkMongooseErrorsOnDuplicateKey;
const comparePasswords = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(password, hash, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
exports.comparePasswords = comparePasswords;
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.hash(password, 12, (err, hash) => {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
};
exports.hashPassword = hashPassword;
const getUserIp = (req) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!ip)
        return 'none';
    return Array.isArray(ip) ? ip[0] : ip;
};
exports.getUserIp = getUserIp;
exports.errorGenerator = {
    badRequest(msg, field) {
        return {
            errorCode: baseTypes_1.HTTP_STATUSES.BAD_REQUEST_400,
            errorMessage: {
                errorsMessages: [
                    { message: msg, field: field }
                ]
            }
        };
    },
    notAuthorized(msg, field) {
        return {
            errorCode: baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401,
            errorMessage: {
                errorsMessages: [
                    { message: msg, field: field }
                ]
            }
        };
    }
};
//# sourceMappingURL=helpers.js.map