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
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const auth_repositry_1 = require("../repositry/auth.repositry");
const jwt_manager_1 = require("../managers/jwt.manager");
const settings_1 = require("../config/settings");
const users_services_1 = require("./users.services");
const email_manager_1 = require("../managers/email.manager");
const helpers_1 = require("../helpers");
const securityDevice_services_1 = require("./securityDevice.services");
let AuthService = class AuthService {
    constructor(authQueryRepo, authCommandRepo, usersService, securityDeviceService) {
        this.authQueryRepo = authQueryRepo;
        this.authCommandRepo = authCommandRepo;
        this.usersService = usersService;
        this.securityDeviceService = securityDeviceService;
    }
    registration(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = jwt_manager_1.jwtService.createJWT({}, settings_1.settings.EXP_CONFIRM_CODE);
            yield this.usersService.createNotConfirmedUser(body, code);
            email_manager_1.emailManager.sendRegCodeConfirm(body.email, code);
        });
    }
    registrationResendEmail(email) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.usersQueryRepo.findByEmail(email);
            if (!user) {
                return helpers_1.errorGenerator.badRequest('User not found', 'email');
            }
            // @ts-ignore
            if ((_a = user.isConfirmedEmail) === null || _a === void 0 ? void 0 : _a.isConfirmedEmail) {
                helpers_1.errorGenerator.badRequest('User already confirmed', 'email');
            }
            const code = jwt_manager_1.jwtService.createJWT({}, settings_1.settings.EXP_CONFIRM_CODE);
            yield this.usersService.update(String(user._id), {
                confirmedInfo: { code, isConfirmedEmail: false }
            });
            email_manager_1.emailManager.sendRegCodeConfirm(email, code);
            return { errorCode: null };
        });
    }
    registrationConfirmation(code) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.usersQueryRepo.findByConfirmCode(code);
            if (!user) {
                return helpers_1.errorGenerator.badRequest('User not found', 'code');
            }
            // @ts-ignore
            if ((_a = user.isConfirmedEmail) === null || _a === void 0 ? void 0 : _a.isConfirmedEmail) {
                return helpers_1.errorGenerator.badRequest('User already confirmed', 'code');
            }
            const isCodeValid = jwt_manager_1.jwtService.verifyToken(code);
            if (!isCodeValid) {
                return helpers_1.errorGenerator.badRequest('Code not valid', 'code');
            }
            yield this.usersService.update(String(user._id), {
                confirmedInfo: { code: '', isConfirmedEmail: true }
            });
            return { errorCode: null };
        });
    }
    login(body, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUserMethod = (0, helpers_1.isEmail)(body.loginOrEmail)
                ? this.usersService.usersQueryRepo.findByEmail.bind(this.usersService.usersQueryRepo)
                : this.usersService.usersQueryRepo.findByLogin.bind(this.usersService.usersQueryRepo);
            const user = yield findUserMethod(body.loginOrEmail);
            if (!user) {
                return helpers_1.errorGenerator.notAuthorized('User not found', 'loginOrEmail');
            }
            const isPasswordValid = yield (0, helpers_1.comparePasswords)(body.password, (user === null || user === void 0 ? void 0 : user.password) || 'none');
            if (!isPasswordValid) {
                return helpers_1.errorGenerator.notAuthorized('Password incoprrect', 'password');
            }
            const accessToken = jwt_manager_1.jwtService.createJWT({
                id: user.id,
                login: user.login,
                email: user.email
            }, settings_1.settings.ACCESS_TOKEN_ALIVE);
            const refreshToken = jwt_manager_1.jwtService.createJWT({
                id: user.id,
                login: user.login,
                email: user.email
            }, settings_1.settings.REFRESH_TOKEN_ALIVE);
            this.securityDeviceService.addUserActiveDeviceSession(user, ipAddress, userAgent);
            return { errorCode: null, accessToken, refreshToken };
        });
    }
    logout(userId, userIp, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.securityDeviceService.deleteUserDeviceSessionByIpAndTitle(userId, userIp, userAgent);
        });
    }
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = jwt_manager_1.jwtService.createJWT({ email }, settings_1.settings.EXP_CONFIRM_CODE);
            email_manager_1.emailManager.sendRecoverPassCodeConfirm(email, code);
        });
    }
    setNewPassword(newPwd, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConfirmationCodeValid = yield jwt_manager_1.jwtService.verifyToken(code);
            if (!isConfirmationCodeValid)
                return helpers_1.errorGenerator.notAuthorized('Recovery code not valid', 'recoveryCode');
            // @ts-ignore
            const userEmail = isConfirmationCodeValid.email;
            const user = yield this.usersService.usersQueryRepo.findByEmail(userEmail);
            if (!user)
                return { errorCode: null };
            const password = yield (0, helpers_1.hashPassword)(newPwd);
            // @ts-ignore
            yield this.usersService.update(user.id, { password });
            return { errorCode: null };
        });
    }
    refreshToken(userId, userIp, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const user = yield this.usersService.usersQueryRepo.findById(userId);
            if (!user)
                return helpers_1.errorGenerator.notAuthorized('refreshToken expired or incorrect', 'refreshToken');
            const accessToken = jwt_manager_1.jwtService.createJWT({
                // @ts-ignore
                id: user.id, login: user.login, email: user.email
            }, settings_1.settings.ACCESS_TOKEN_ALIVE);
            const refreshToken = jwt_manager_1.jwtService.createJWT({
                // @ts-ignore
                id: user.id, login: user.login, email: user.email
            }, settings_1.settings.REFRESH_TOKEN_ALIVE);
            yield this.securityDeviceService.deleteUserDeviceSessionByIpAndTitle(userId, userIp, userAgent);
            yield this.securityDeviceService.addUserActiveDeviceSession(user, userIp, userAgent);
            return { errorCode: null, accessToken, refreshToken };
        });
    }
    getMeInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersService.usersQueryRepo.meInfoById(userId);
        });
    }
};
AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_repositry_1.AuthQueryRepo)),
    __param(1, (0, inversify_1.inject)(auth_repositry_1.AuthCommandRepo)),
    __param(2, (0, inversify_1.inject)(users_services_1.UsersService)),
    __param(3, (0, inversify_1.inject)(securityDevice_services_1.SecurityDeviceService)),
    __metadata("design:paramtypes", [auth_repositry_1.AuthQueryRepo,
        auth_repositry_1.AuthCommandRepo,
        users_services_1.UsersService,
        securityDevice_services_1.SecurityDeviceService])
], AuthService);
exports.AuthService = AuthService;
