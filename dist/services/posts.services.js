"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const inversify_1 = require("inversify");
const posts_repositry_1 = require("../repositry/posts.repositry");
const baseTypes_1 = require("../config/baseTypes");
const blogs_repositry_1 = require("../repositry/blogs.repositry");
let PostsService = class PostsService {
    constructor(postsQueryRepo, blogsQueryRepo, postsCommandRepo) {
        this.postsQueryRepo = postsQueryRepo;
        this.blogsQueryRepo = blogsQueryRepo;
        this.postsCommandRepo = postsCommandRepo;
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogName = body.blogName || '';
            if (body.blogId) {
                const blog = yield this.blogsQueryRepo.findById(body.blogId);
                // @ts-ignore
                blogName = blog ? blog.name : '';
            }
            return yield this.postsCommandRepo.create(Object.assign(Object.assign({}, body), { blogName }));
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: сделать возможность правильного обновления blogName при смене blogId
            return yield this.postsCommandRepo.update(id, body);
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsCommandRepo.deleteOne(id);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsCommandRepo.deleteAll();
        });
    }
    likeUnlikePost(id, likeStatus, post, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const likesInfo = post.extendedLikesInfo;
            const oldStatus = likesInfo.myStatus;
            if (oldStatus === baseTypes_1.Likes.LIKE)
                likesInfo.likesCount--;
            else if (oldStatus === baseTypes_1.Likes.DISLIKE)
                likesInfo.dislikesCount--;
            const newStatus = likeStatus;
            if (newStatus === baseTypes_1.Likes.LIKE)
                likesInfo.likesCount++;
            else if (newStatus === baseTypes_1.Likes.DISLIKE)
                likesInfo.dislikesCount++;
            if (!likesInfo.newestLikes)
                likesInfo.newestLikes = [];
            likesInfo.newestLikes = likesInfo.newestLikes; // filter((i: any) => i.userId !== user.id)
            if (newStatus !== baseTypes_1.Likes.NONE) {
                likesInfo.newestLikes.push({
                    addedAt: new Date().toISOString(),
                    userId: user.id,
                    login: user.login,
                    status: newStatus
                });
            }
            // delete likesInfo.myStatus;
            return yield this.update(id, Object.assign(Object.assign({}, post), { likesInfo }));
        });
    }
};
PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_repositry_1.PostsQueryRepo)),
    __param(1, (0, inversify_1.inject)(blogs_repositry_1.BlogsQueryRepo)),
    __param(2, (0, inversify_1.inject)(posts_repositry_1.PostsCommandRepo)),
    __metadata("design:paramtypes", [posts_repositry_1.PostsQueryRepo,
        blogs_repositry_1.BlogsQueryRepo,
        posts_repositry_1.PostsCommandRepo])
], PostsService);
exports.PostsService = PostsService;
