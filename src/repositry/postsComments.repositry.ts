import {injectable} from "inversify";
import {PostComment, PostCommentBodyT} from '../models/postsComments.models';
import {BaseQueryT, Likes} from "../config/baseTypes";
import {baseRepositry} from "./base.repositry";
import {ObjectId} from "mongodb";

@injectable()
export class PostsCommentsQueryRepo {
    protected PostComment;
    constructor() {
        this.PostComment = PostComment;
    }
    async find(
        userId: string | undefined,
        params: BaseQueryT,
        filters: {}
    ) {
        const result = await baseRepositry.find(this.PostComment, params, filters, {});
        return {
            // @ts-ignore
            ...result,
            // @ts-ignore
            items: result.items.map((i) => commentMap(i, userId))
        }
    }

    findByEmail(email: string) {
        return baseRepositry.findByFields(this.PostComment, { email: email }, {});
    }
    findByLogin(login: string) {
        return baseRepositry.findByFields(this.PostComment, { login: login }, {});
    }
    findByConfirmCode(code: string) {
        return baseRepositry.findByFields(this.PostComment, { 'confirmedInfo.code': code }, {});
    }

    async findById(id: string, userId: string | undefined) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        let row = await baseRepositry.findById(this.PostComment, id, {});
        if (!row) return false;
        return commentMap(row, userId);
    }
}

function commentMap(i: any, userId: string | undefined) {
    return {
        id: i.id,
        content: i.content,
        commentatorInfo: {
            userId: i.commentatorInfo.userId,
            userLogin: i.commentatorInfo.userId
        },
        createdAt: i.createdAt,
        updatedAt: i.createdAt,
        likesInfo: {
            likesCount: i.likesInfo.likesCount,
            dislikesCount: i.likesInfo.dislikesCount,
            myStatus: userId && i.likesInfo?.usersStatistics[userId] ? i.likesInfo?.usersStatistics[userId] : Likes.NONE
        }
    }
}

@injectable()
export class PostsCommentsCommandRepo {
    protected PostComment;
    constructor() {
        this.PostComment = PostComment;
    }
    async create(user: PostCommentBodyT): Promise<string> {
        const createdRow = await this.PostComment.create(user);
        return String(createdRow._id);
    }
    async update(id: string, payload: PostCommentBodyT): Promise<string | null> {
        if (!ObjectId.isValid(id)) return Promise.resolve(null);
        const createdRow = await this.PostComment.findByIdAndUpdate({ _id: id }, payload);
        return createdRow ? String(createdRow._id) : null;
    }
    async deleteAll() {
        const result = await this.PostComment.deleteMany();
        return result.deletedCount > 0;
    }
    async deleteOne(id: string) {
        if (!ObjectId.isValid(id)) return Promise.resolve(false);
        const result = await this.PostComment.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}