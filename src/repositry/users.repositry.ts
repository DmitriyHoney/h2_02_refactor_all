import {injectable} from "inversify";
import {User, UserPostT, UserUpdateT} from "../models/users.models";
import {BaseQueryT} from "../config/baseTypes";
import {baseRepositry} from "./base.repositry";
import {ObjectId} from "mongodb";

@injectable()
export class UsersQueryRepo {
    protected User;
    constructor() {
        this.User = User;
    }
    find(
        params: BaseQueryT,
        filters: { searchLoginTerm?: string, searchEmailTerm?: string }
    ) {
        const prepareFilters: any = { $or: [] };
        if (filters.searchLoginTerm) prepareFilters.$or.push({ login: { $regex: filters.searchLoginTerm, $options: "i" } })
        if (filters.searchEmailTerm) prepareFilters.$or.push({ email: { $regex: filters.searchEmailTerm, $options: "i" } });
        return baseRepositry.find(this.User, params, prepareFilters, { password: 0 });
    }

    findByEmail(email: string) {
        return baseRepositry.findByFields(this.User, { email: email }, {});
    }
    findByConfirmCode(code: string) {
        return baseRepositry.findByFields(this.User, { 'confirmedInfo.code': code }, {});
    }

    async findById(userId: string) {
        return await baseRepositry.findById(this.User, userId, {
            confirmedInfo: 0,
            password: 0,
            updatedAt: 0,
        });
    }
}

@injectable()
export class UsersCommandRepo {
    protected User;
    constructor() {
        this.User = User;
    }
    async create(user: UserPostT): Promise<string> {
        const createdRow = await this.User.create(user);
        return String(createdRow._id);
    }
    async update(id: string, userPayload: UserUpdateT): Promise<string | null> {
        const createdRow = await this.User.findByIdAndUpdate(id, userPayload);
        return createdRow ? String(createdRow._id) : null;
    }
    async deleteAll() {
        const result = await this.User.deleteMany();
        return result.deletedCount > 0;
    }
    async deleteOne(id: string) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        const result = await this.User.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}