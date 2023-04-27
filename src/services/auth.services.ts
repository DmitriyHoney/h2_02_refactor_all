import {inject, injectable} from "inversify";
import { AuthCommandRepo, AuthQueryRepo } from '../repositry/auth.repositry';
import {UserPostT} from "../models/users.models";
import {jwtService} from "../managers/jwt.manager";
import {settings} from "../config/settings";
import {UsersService} from "./users.services";
import {emailManager} from "../managers/email.manager";

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
}