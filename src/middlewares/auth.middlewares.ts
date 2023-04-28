import { Request, Response, NextFunction } from 'express';
import {HTTP_STATUSES, VALIDATION_ERROR_MSG} from '../config/baseTypes';
import { settings } from '../config/settings';
import rateLimit from 'express-rate-limit';

import { body } from 'express-validator';
import { isEmail } from '../helpers';

export const registrationResendingEmailBody = [
    body('email')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom((value) => {
            if (!isEmail(value)) throw new Error(VALIDATION_ERROR_MSG.EMAIL_NOT_VALID_TEMPLATE);
            return true;
        }),
]

export const registrationConfirmationBody = [
    body('code')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
]

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

export const rateLimiterUsingThirdParty = (ms = 10000, max = 5) => {
    return rateLimit({
        windowMs: ms,
        max: max,
        message: 'More than 5 attempts from one IP-address during 10 seconds',
        standardHeaders: true,
        legacyHeaders: false,
    })
};