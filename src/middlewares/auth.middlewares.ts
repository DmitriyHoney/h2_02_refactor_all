import { Request, Response, NextFunction } from 'express';
import {HTTP_STATUSES, VALIDATION_ERROR_MSG} from '../config/baseTypes';
import { settings } from '../config/settings';
import rateLimit from 'express-rate-limit';

import { body } from 'express-validator';
import {getUserIp, isEmail} from '../helpers';
import {jwtService} from "../managers/jwt.manager";
import container from '../composition/users.composition';
import {UsersService} from "../services/users.services";

const userService = container.resolve(UsersService);


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

export const loginBody = [
    body('loginOrEmail')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail(),
    body('password')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
]

export const passwordRecoveryBody = [
    body('email')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom((value) => {
            if (!isEmail(value)) throw new Error(VALIDATION_ERROR_MSG.EMAIL_NOT_VALID_TEMPLATE);
            return true;
        }),
];

export const newPasswordBody = [
    body('newPassword')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail(),
    body('recoveryCode')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
];

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

export const authJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken && req.headers?.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const verifiedToken = jwtService.verifyToken(token);
        if (verifiedToken) {
            if (!req.context) req.context = { user: null };
            // @ts-ignore
            req.context.user = await userService.usersQueryRepo.findById(verifiedToken?.id);
        }
        return next();
    }
    if (!refreshToken) return next();

    const verifiedToken = jwtService.verifyToken(refreshToken);
    console.log('verifiedToken', verifiedToken);
    
    
    if (!verifiedToken) return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');

    if (!req.context) req.context = { user: null };
    // @ts-ignore
    req.context.user = await userService.usersQueryRepo.findById(verifiedToken.id);
    next();
};

export const authJwtAccessMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        if (req?.context?.user) req.context.user = null;
        return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send();
    }
    const token = req.headers.authorization.split(' ')[1];

    const payload = jwtService.verifyToken(token);

    if (payload) {
        if (!req.context) req.context = { user: null };
        // @ts-ignore
        req.context.user = await userService.usersQueryRepo.findById(payload.id);
        if (!req.context.user) {
            req.context.user = null;
            return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send();
        }
        next();
    } else {
        if (req?.context?.user) req.context.user = null;
        return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send();
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