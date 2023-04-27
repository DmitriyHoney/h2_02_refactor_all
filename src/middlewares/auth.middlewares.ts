import { Request, Response, NextFunction } from 'express';
import {HTTP_STATUSES, VALIDATION_ERROR_MSG} from '../config/baseTypes';
import { settings } from '../config/settings';
import {body} from "express-validator";
import {isEmail, isLogin} from "../helpers";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers?.authorization) return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    const [prefix, authInfo] = req.headers.authorization?.split(' ');
    if (prefix.trim() !== 'Basic') return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    const [login, pwd] = Buffer.from(authInfo, 'base64').toString().split(':');
    // @ts-ignore
    if (settings.BASIC_USERS[login] === pwd && login && pwd) {
      next();
    } else {
      return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    }
};