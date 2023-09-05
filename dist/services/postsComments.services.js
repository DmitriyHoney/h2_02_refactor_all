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
exports.PostsCommentsService = void 0;
const inversify_1 = require("inversify");
const postsComments_repositry_1 = require("../repositry/postsComments.repositry");
const baseTypes_1 = require("../config/baseTypes");
let PostsCommentsService = class PostsCommentsService {
    constructor(postsCommentsQueryRepo, postsCommentsCommandRepo) {
        this.postsCommentsQueryRepo = postsCommentsQueryRepo;
        this.postsCommentsCommandRepo = postsCommentsCommandRepo;
    }
    create(user, postId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsCommentsCommandRepo.create(Object.assign(Object.assign({}, body), { commentatorInfo: {
                    // @ts-ignore
                    userId: user.id,
                    userLogin: user.login,
                } }));
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsCommentsCommandRepo.update(id, body);
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsCommentsCommandRepo.deleteOne(id);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsCommentsCommandRepo.deleteAll();
        });
    }
    likeUnlikeComment(id, likeStatus, comment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likesInfo = comment.likesInfo;
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
            if (!likesInfo.usersStatistics)
                likesInfo.usersStatistics = {};
            likesInfo.usersStatistics[userId] = newStatus;
            delete likesInfo.myStatus;
            return yield this.update(id, Object.assign(Object.assign({}, comment), { likesInfo }));
        });
    }
};
PostsCommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(postsComments_repositry_1.PostsCommentsQueryRepo)),
    __param(1, (0, inversify_1.inject)(postsComments_repositry_1.PostsCommentsCommandRepo)),
    __metadata("design:paramtypes", [postsComments_repositry_1.PostsCommentsQueryRepo,
        postsComments_repositry_1.PostsCommentsCommandRepo])
], PostsCommentsService);
exports.PostsCommentsService = PostsCommentsService;
//# sourceMappingURL=postsComments.services.js.map