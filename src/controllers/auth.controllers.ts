import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { HTTP_STATUSES } from "../config/baseTypes";
import {AuthService} from "../services/auth.services";
import {UserPostT} from "../models/users.models";
import {checkMongooseErrorsOnDuplicateKey, getUserIp} from "../helpers";

@injectable()
export class AuthControllers {
    constructor(
        @inject(AuthService) protected authService: AuthService
    ) {}
    async registration(
        req: Request<{}, {}, UserPostT, {}>,
        res: Response
    ) {
        try {
            await this.authService.registration(req.body);
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({});
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
    async registrationResendEmail(
        req: Request<{}, {}, { email: string }, {}>,
        res: Response
    ) {
        try {
            const result = await this.authService.registrationResendEmail(req.body.email);
            if (result.errorCode) return res.status(result.errorCode).send(result.errorMessage);
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } catch (e) {
            return res.status(HTTP_STATUSES.SERVER_ERROR_500).send(e);
        }
    }
    async registrationConfirmation(
        req: Request<{}, {}, { code: string }, {}>,
        res: Response
    ) {
        try {
            const result = await this.authService.registrationConfirmation(req.body.code);
            if (result.errorCode) return res.status(result.errorCode).send(result.errorMessage);
            res.status(HTTP_STATUSES.NO_CONTENT_204).send();
        } catch (e) {
            return res.status(HTTP_STATUSES.SERVER_ERROR_500).send(e);
        }
    }
    async login(
        req: Request<{}, {}, { loginOrEmail: string, password: string }, {}>,
        res: Response
    ) {
        try {
            const result = await this.authService.login(req.body, getUserIp(req), req.get('User-Agent') || 'user agent unknown');
            if (result.errorCode) return res.status(result.errorCode).send(result.errorMessage);
            res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true });
            res.status(HTTP_STATUSES.OK_200).send({ accessToken: result.accessToken });
        } catch (e) {
            console.log(e);
            return res.status(HTTP_STATUSES.SERVER_ERROR_500).send(e);
        }
    }
    async logout(
        req: Request<{}, {}, {}, {}>,
        res: Response
    ) {
        await this.authService.logout(req.context.user.id, getUserIp(req), req.get('User-Agent') || 'user agent unknown');
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
    async passwordRecovery(
        req: Request<{}, {}, { email: string }, {}>,
        res: Response
    ) {
        await this.authService.passwordRecovery(req.body.email);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
    async setNewPassword(
        req: Request<{}, {}, { newPassword: string, recoveryCode: string }, {}>,
        res: Response
    ) {
        const result = await this.authService.setNewPassword(req.body.newPassword, req.body.recoveryCode);
        if (result.errorCode) return res.status(result.errorCode).send(result.errorMessage);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
}