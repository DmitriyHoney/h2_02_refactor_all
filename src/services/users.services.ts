import {inject, injectable} from "inversify";
import {UsersCommandRepo, UsersQueryRepo} from "../repositry/users.repositry";
import {UserPostT, UserUpdateT} from "../models/users.models";

@injectable()
export class UsersService {
    constructor(
        @inject(UsersQueryRepo) public usersQueryRepo: UsersQueryRepo,
        @inject(UsersCommandRepo) protected usersCommandRepo: UsersCommandRepo
    ) {}
    async createConfirmedUser(body: UserPostT): Promise<string> {
        return await this.usersCommandRepo.create(body);
    }
    async createNotConfirmedUser(body: UserPostT, code: string): Promise<string> {
        return await this.usersCommandRepo.create({
            ...body,
            confirmedInfo: {
                isConfirmedEmail: false,
                code,
            }
        });
    }
    async update(userId: string, body: UserUpdateT) {
        return await this.usersCommandRepo.update(userId, body);
    }
    async deleteOne(id: string) {
        return await this.usersCommandRepo.deleteOne(id);
    }
    async deleteAll() {
        return await this.usersCommandRepo.deleteAll();
    }
}