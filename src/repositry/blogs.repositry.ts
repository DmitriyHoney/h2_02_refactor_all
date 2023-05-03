import {injectable} from "inversify";
import {Blog, BlogInputT} from "../models/blogs.models";
import {BaseQueryT} from "../config/baseTypes";
import {baseRepositry} from "./base.repositry";
import {ObjectId} from "mongodb";

@injectable()
export class BlogsQueryRepo {
    protected Blog;
    constructor() {
        this.Blog = Blog;
    }
    find(
        params: BaseQueryT,
        filters: {}
    ) {
        return baseRepositry.find(this.Blog, params, filters, {});
    }

    findByEmail(email: string) {
        return baseRepositry.findByFields(this.Blog, { email: email }, {});
    }
    findByLogin(login: string) {
        return baseRepositry.findByFields(this.Blog, { login: login }, {});
    }
    findByConfirmCode(code: string) {
        return baseRepositry.findByFields(this.Blog, { 'confirmedInfo.code': code }, {});
    }

    async findById(id: string) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        return await baseRepositry.findById(this.Blog, id, {});
    }
}

@injectable()
export class BlogsCommandRepo {
    protected Blog;
    constructor() {
        this.Blog = Blog;
    }
    async create(user: BlogInputT): Promise<string> {
        const createdRow = await this.Blog.create(user);
        return String(createdRow._id);
    }
    async update(id: string, userPayload: BlogInputT): Promise<string | null> {
        if (!ObjectId.isValid(id)) return Promise.resolve(null);
        const createdRow = await this.Blog.findByIdAndUpdate({ _id: id }, userPayload);
        return createdRow ? String(createdRow._id) : null;
    }
    async deleteAll() {
        const result = await this.Blog.deleteMany();
        return result.deletedCount > 0;
    }
    async deleteOne(id: string) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        const result = await this.Blog.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}