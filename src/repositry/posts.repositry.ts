import {injectable} from "inversify";
import {Post, PostInputT} from '../models/posts.models';
import {BaseQueryT, Likes} from "../config/baseTypes";
import {baseRepositry} from "./base.repositry";
import {ObjectId} from "mongodb";

@injectable()
export class PostsQueryRepo {
    protected Post;
    constructor() {
        this.Post = Post;
    }
    async find(
        userId: string | undefined,
        params: BaseQueryT,
        filters: {}
    ) {
        const result = await baseRepositry.find(this.Post, params, filters, {});
        return {
            // @ts-ignore
            ...result,
            // @ts-ignore
            items: result.items.map((i) => postMap(i, userId))
        }
    }
    async findById(id: string, userId: string | undefined, excludeMeta = true) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        let row = await baseRepositry.findById(this.Post, id, {});
        if (!row) return false;
        return postMap(row, userId, excludeMeta);
    }
}

function postMap(i: any, userId: string | undefined, excludeMeta = true) {
    const userStatus = i.extendedLikesInfo?.newestLikes.find((u: any) => u.userId === userId && u.status);
    const myStatus = userStatus ? userStatus.status : Likes.NONE;
    const newestLikes = i.extendedLikesInfo?.newestLikes
        .filter((i: any) => i.status === Likes.LIKE) // && i.userId !== userId
        .map((i: any) => {
            const result = {
                addedAt: i.addedAt,
                userId: i.userId,
                login: i.login,
                status: i.status,
            }
            if (excludeMeta) delete result.status;
            return result;
        })
        .sort(function(a: any, b: any) {
            return (a.addedAt > b.addedAt) ? -1 : ((a.addedAt < b.addedAt) ? 1 : 0);
        }).slice(0, 3);

    return {
        id: i.id,
        title: i.content,
        shortDescription: i.shortDescription,
        content: i.content,
        blogId: i.blogId,
        blogName: i.blogName,
        createdAt: i.createdAt,
        extendedLikesInfo: {
            likesCount: i.extendedLikesInfo.likesCount,
            dislikesCount: i.extendedLikesInfo.dislikesCount,
            myStatus: myStatus,
            newestLikes: newestLikes,
        }
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