import {inject, injectable} from "inversify";
import {PostsQueryRepo, PostsCommandRepo} from '../repositry/posts.repositry';
import {PostInputT} from '../models/posts.models';
import {Likes} from "../config/baseTypes";

@injectable()
export class PostsService {
    constructor(
        @inject(PostsQueryRepo) public postsQueryRepo: PostsQueryRepo,
        @inject(PostsCommandRepo) protected postsCommandRepo: PostsCommandRepo
    ) {}
    async create(body: PostInputT): Promise<string> {
        return await this.postsCommandRepo.create(body);
    }
    async update(id: string, body: PostInputT) {
        return await this.postsCommandRepo.update(id, body);
    }
    async deleteOne(id: string) {
        return await this.postsCommandRepo.deleteOne(id);
    }
    async deleteAll() {
        return await this.postsCommandRepo.deleteAll();
    }
    async likeUnlikePost(id: string, likeStatus: string, post: any, user: any) {
        const likesInfo = post.extendedLikesInfo;
        const oldStatus = likesInfo.myStatus;
        if (oldStatus === Likes.LIKE) likesInfo.likesCount--;
        else if (oldStatus === Likes.DISLIKE) likesInfo.dislikesCount--;

        const newStatus = likeStatus;
        if (newStatus === Likes.LIKE) likesInfo.likesCount++;
        else if (newStatus === Likes.DISLIKE) likesInfo.dislikesCount++;

        if (!likesInfo.newestLikes) likesInfo.newestLikes = [];
        likesInfo.newestLikes = likesInfo.newestLikes.filter((i: any) => i.userId !== user.id);
        if (newStatus !== Likes.NONE) {
            likesInfo.newestLikes.push({
                addedAt: new Date().toISOString(),
                userId: user.id,
                login: user.login,
                status: newStatus
            });
        }
        delete likesInfo.myStatus;
        return await this.update(id, { ...post, likesInfo });
    }
}