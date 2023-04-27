import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { HTTP_STATUSES } from "../config/baseTypes";
import {AuthService} from "../services/auth.services";
import {UserPostT} from "../models/users.models";
import {checkMongooseErrorsOnDuplicateKey} from "../helpers";

@injectable()
export class AuthControllers {
    constructor(@inject(AuthService) protected authService: AuthService) {}
    async registration(
        req: Request<{}, {}, UserPostT, {}>,
        res: Response
    ) {
        try {
            const result = await this.authService.registration(req.body);
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({});
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
}