"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterUsingThirdParty = exports.authJwtAccessMiddleware = exports.authJwtMiddleware = exports.basicAuthMiddleware = exports.newPasswordBody = exports.passwordRecoveryBody = exports.loginBody = exports.registrationConfirmationBody = exports.registrationResendingEmailBody = void 0;
const baseTypes_1 = require("../config/baseTypes");
const settings_1 = require("../config/settings");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const helpers_1 = require("../helpers");
const jwt_manager_1 = require("../managers/jwt.manager");
const users_composition_1 = __importDefault(require("../composition/users.composition"));
const users_services_1 = require("../services/users.services");
const userService = users_composition_1.default.resolve(users_services_1.UsersService);
exports.registrationResendingEmailBody = [
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom((value) => {
        if (!(0, helpers_1.isEmail)(value))
            throw new Error(baseTypes_1.VALIDATION_ERROR_MSG.EMAIL_NOT_VALID_TEMPLATE);
        return true;
    }),
];
exports.registrationConfirmationBody = [
    (0, express_validator_1.body)('code')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
];
exports.loginBody = [
    (0, express_validator_1.body)('loginOrEmail')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
];
exports.passwordRecoveryBody = [
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom((value) => {
        if (!(0, helpers_1.isEmail)(value))
            throw new Error(baseTypes_1.VALIDATION_ERROR_MSG.EMAIL_NOT_VALID_TEMPLATE);
        return true;
    }),
];
exports.newPasswordBody = [
    (0, express_validator_1.body)('newPassword')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail(),
    (0, express_validator_1.body)('recoveryCode')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
];
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
const authJwtMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken && ((_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization)) {
        const token = req.headers.authorization.split(' ')[1];
        const verifiedToken = jwt_manager_1.jwtService.verifyToken(token);
        if (verifiedToken) {
            if (!req.context)
                req.context = { user: null };
            // @ts-ignore
            req.context.user = yield userService.usersQueryRepo.findById(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.id);
        }
        return next();
    }
    if (!refreshToken)
        return next();
    const verifiedToken = jwt_manager_1.jwtService.verifyToken(refreshToken);
    if (!verifiedToken)
        return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send('Not authorized');
    if (!req.context)
        req.context = { user: null };
    // @ts-ignore
    req.context.user = yield userService.usersQueryRepo.findById(verifiedToken.id);
    next();
});
exports.authJwtMiddleware = authJwtMiddleware;
const authJwtAccessMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    if (!req.headers.authorization) {
        if ((_c = req === null || req === void 0 ? void 0 : req.context) === null || _c === void 0 ? void 0 : _c.user)
            req.context.user = null;
        return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send();
    }
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt_manager_1.jwtService.verifyToken(token);
    if (payload) {
        if (!req.context)
            req.context = { user: null };
        // @ts-ignore
        req.context.user = yield userService.usersQueryRepo.findById(payload.id);
        if (!req.context.user) {
            req.context.user = null;
            return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send();
        }
        next();
    }
    else {
        if ((_d = req === null || req === void 0 ? void 0 : req.context) === null || _d === void 0 ? void 0 : _d.user)
            req.context.user = null;
        return res.status(baseTypes_1.HTTP_STATUSES.NOT_AUTHORIZED_401).send();
    }
});
exports.authJwtAccessMiddleware = authJwtAccessMiddleware;
const rateLimiterUsingThirdParty = (ms = 10000, max = 5) => {
    return (0, express_rate_limit_1.default)({
        windowMs: ms,
        max: max,
        message: 'More than 5 attempts from one IP-address during 10 seconds',
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.rateLimiterUsingThirdParty = rateLimiterUsingThirdParty;
//# sourceMappingURL=auth.middlewares.js.map