import {inject, injectable} from "inversify";
import { AuthCommandRepo, AuthQueryRepo } from '../repositry/auth.repositry';
import {UserPostT} from "../models/users.models";
import {jwtService} from "../managers/jwt.manager";
import {settings} from "../config/settings";
import {UsersService} from "./users.services";
import {emailManager} from "../managers/email.manager";
import {ErrorsForControllers, HTTP_STATUSES} from "../config/baseTypes";
import {comparePasswords, errorGenerator, isEmail} from "../helpers";

@injectable()
export class AuthService {
    constructor(
        @inject(AuthQueryRepo) public authQueryRepo: AuthQueryRepo,
        @inject(AuthCommandRepo) protected authCommandRepo: AuthCommandRepo,
        @inject(UsersService) protected usersService: UsersService,
    ) {}
    async registration(body: UserPostT) {
        const code = jwtService.createJWT({}, settings.EXP_CONFIRM_CODE);
        await this.usersService.createNotConfirmedUser(body, code);
        emailManager.sendRegCodeConfirm(body.email, code);
    }
    async registrationResendEmail(email: string) {
        const user = await this.usersService.usersQueryRepo.findByEmail(email);
        if (!user) {
            return errorGenerator.badRequest('User not found', 'email');
        }
        // @ts-ignore
        if (user.isConfirmedEmail?.isConfirmedEmail) {
            errorGenerator.badRequest('User already confirmed', 'email');
        }

        const code = jwtService.createJWT({}, settings.EXP_CONFIRM_CODE);
        await this.usersService.update(String(user._id), {
            confirmedInfo: { code, isConfirmedEmail: false }
        });
        emailManager.sendRegCodeConfirm(email, code);
        return { errorCode: null };
    }
    async registrationConfirmation(code: string) {
        const user = await this.usersService.usersQueryRepo.findByConfirmCode(code);
        if (!user) {
            return errorGenerator.badRequest('User not found', 'code');
        }
        // @ts-ignore
        if (user.isConfirmedEmail?.isConfirmedEmail) {
            return errorGenerator.badRequest('User already confirmed', 'code');
        }
        const isCodeValid = jwtService.verifyToken(code);
        if (!isCodeValid) {
            return errorGenerator.badRequest('Code not valid', 'code');
        }
        await this.usersService.update(String(user._id), {
            confirmedInfo: { code: '', isConfirmedEmail: true }
        });
        return { errorCode: null };
    }
    async login(body: { loginOrEmail: string, password: string }) {
        const findUserMethod = isEmail(body.loginOrEmail)
            ? this.usersService.usersQueryRepo.findByEmail.bind(this.usersService.usersQueryRepo)
            : this.usersService.usersQueryRepo.findByLogin.bind(this.usersService.usersQueryRepo);

        const user = await findUserMethod(body.loginOrEmail);
        if (!user) {
            return errorGenerator.notAuthorized('User not found', 'loginOrEmail');
        }
        const isPasswordValid = await comparePasswords(body.password, user?.password || 'none');
        if (!isPasswordValid) {
            return errorGenerator.notAuthorized('Password incoprrect', 'password');
        }

        const accessToken = jwtService.createJWT({
            id: user.id,
            login: user.login,
            email: user.email
        }, settings.ACCESS_TOKEN_ALIVE);
        const refreshToken = jwtService.createJWT({
            id: user.id,
            login: user.login,
            email: user.email
        }, settings.REFRESH_TOKEN_ALIVE);

        return { errorCode: null, accessToken, refreshToken };
    }
}