"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const inversify_1 = require("inversify");
const baseTypes_1 = require("../config/baseTypes");
const auth_services_1 = require("../services/auth.services");
const helpers_1 = require("../helpers");
let AuthControllers = class AuthControllers {
    constructor(authService) {
        this.authService = authService;
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.registration(req.body);
                res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send({});
            }
            catch (e) {
                const error = e;
                return res.status(baseTypes_1.HTTP_STATUSES.BAD_REQUEST_400).send((0, helpers_1.checkMongooseErrorsOnDuplicateKey)(error));
            }
        });
    }
    registrationResendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.registrationResendEmail(req.body.email);
                if (result.errorCode)
                    return res.status(result.errorCode).send(result.errorMessage);
                res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
            }
            catch (e) {
                return res.status(baseTypes_1.HTTP_STATUSES.SERVER_ERROR_500).send(e);
            }
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.registrationConfirmation(req.body.code);
                if (result.errorCode)
                    return res.status(result.errorCode).send(result.errorMessage);
                res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
            }
            catch (e) {
                return res.status(baseTypes_1.HTTP_STATUSES.SERVER_ERROR_500).send(e);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.login(req.body, (0, helpers_1.getUserIp)(req), req.get('User-Agent') || 'user agent unknown');
                if (result.errorCode)
                    return res.status(result.errorCode).send(result.errorMessage);
                res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true });
                res.status(baseTypes_1.HTTP_STATUSES.OK_200).send({ accessToken: result.accessToken });
            }
            catch (e) {
                console.log(e);
                return res.status(baseTypes_1.HTTP_STATUSES.SERVER_ERROR_500).send(e);
            }
        });
    }
    logout(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.logout((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, (0, helpers_1.getUserIp)(req), req.get('User-Agent') || 'user agent unknown');
            res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.passwordRecovery(req.body.email);
            res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    setNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.setNewPassword(req.body.newPassword, req.body.recoveryCode);
            if (result.errorCode)
                return res.status(result.errorCode).send(result.errorMessage);
            res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    refreshPassword(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.refreshToken((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, (0, helpers_1.getUserIp)(req), req.get('User-Agent') || 'user agent unknown');
            if (result.errorCode)
                return res.status(result.errorCode).send(result.errorMessage);
            res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true });
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send({ accessToken: result.accessToken });
        });
    }
    getMeInfo(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.getMeInfo((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!user)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(user);
        });
    }
};
AuthControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_services_1.AuthService)),
    __metadata("design:paramtypes", [auth_services_1.AuthService])
], AuthControllers);
exports.AuthControllers = AuthControllers;
