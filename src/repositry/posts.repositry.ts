import {injectable} from "inversify";
import {Post, PostInputT} from '../models/posts.models';
import {BaseQueryT} from "../config/baseTypes";
import {baseRepositry} from "./base.repositry";
import {ObjectId} from "mongodb";

@injectable()
export class PostsQueryRepo {
    protected Post;
    constructor() {
        this.Post = Post;
    }
    find(
        params: BaseQueryT,
        filters: {}
    ) {
        return baseRepositry.find(this.Post, params, filters, {});
    }
    async findById(id: string) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        return await baseRepositry.findById(this.Post, id, {});
    }
}

@injectable()
export class PostsCommandRepo {
    protected Post;
    constructor() {
        this.Post = Post;
    }
    async create(user: PostInputT): Promise<string> {
        const createdRow = await this.Post.create(user);
        return String(createdRow._id);
    }
    async update(id: string, userPayload: PostInputT): Promise<string | null> {
        if (!ObjectId.isValid(id)) return Promise.resolve(null);
        const createdRow = await this.Post.findByIdAndUpdate({ _id: id }, userPayload);
        return createdRow ? String(createdRow._id) : null;
    }
    async deleteAll() {
        const result = await this.Post.deleteMany();
        return result.deletedCount > 0;
    }
    async deleteOne(id: string) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        const result = await this.Post.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}