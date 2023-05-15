"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const baseTypes_1 = require("../config/baseTypes");
const settings_1 = require("../config/settings");
const basicAuthMiddleware = (req, res, next) => {
    var _a, _b;
    if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization))
        return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    const [prefix, authInfo] = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ');
    if (prefix.trim() !== 'Basic')
        return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    const [login, pwd] = Buffer.from(authInfo, 'base64').toString().split(':');
    // @ts-ignore
    if (settings_1.settings.BASIC_USERS[login] === pwd && login && pwd) {
        next();
    }
    else {
        return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
