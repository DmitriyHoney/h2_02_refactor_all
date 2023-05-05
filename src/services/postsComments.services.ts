import {inject, injectable} from "inversify";
import {PostCommentBodyT} from "../models/postsComments.models";
import {PostsCommentsCommandRepo, PostsCommentsQueryRepo} from "../repositry/postsComments.repositry";
import {UserPostT} from "../models/users.models";
import {Request, Response} from "express";
import {HTTP_STATUSES, Likes} from "../config/baseTypes";

@injectable()
export class PostsCommentsService {
    constructor(
        @inject(PostsCommentsQueryRepo) public postsCommentsQueryRepo: PostsCommentsQueryRepo,
        @inject(PostsCommentsCommandRepo) protected postsCommentsCommandRepo: PostsCommentsCommandRepo
    ) {}
    async create(user: UserPostT, postId: string, body: any): Promise<string> {
        return await this.postsCommentsCommandRepo.create({
            ...body,
            commentatorInfo: {
                // @ts-ignore
                userId: user.id,
                userLogin: user.login,
            },
        });
    }
    async update(id: string, body: PostCommentBodyT) {
        return await this.postsCommentsCommandRepo.update(id, body);
    }
    async deleteOne(id: string) {
        return await this.postsCommentsCommandRepo.deleteOne(id);
    }
    async deleteAll() {
        return await this.postsCommentsCommandRepo.deleteAll();
    }
    async likeUnlikeComment(id: string, likeStatus: string, likesInfo: any, userId: string) {
        const oldStatus = likesInfo.myStatus;
        if (oldStatus === Likes.LIKE) likesInfo.likesCount--;
        else if (oldStatus === Likes.DISLIKE) likesInfo.dislikesCount--;

        const newStatus = likeStatus;
        if (newStatus === Likes.LIKE) likesInfo.likesCount--;
        else if (newStatus === Likes.DISLIKE) likesInfo.dislikesCount--;

        likesInfo.usersStatistics[userId] = newStatus;

        return await this.update(id, likesInfo);
    }
}