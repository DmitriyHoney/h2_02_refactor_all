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
exports.PostsCommandRepo = exports.PostsQueryRepo = void 0;
const inversify_1 = require("inversify");
const posts_models_1 = require("../models/posts.models");
const baseTypes_1 = require("../config/baseTypes");
const base_repositry_1 = require("./base.repositry");
const mongodb_1 = require("mongodb");
let PostsQueryRepo = class PostsQueryRepo {
    constructor() {
        this.Post = posts_models_1.Post;
    }
    find(userId, params, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield base_repositry_1.baseRepositry.find(this.Post, params, filters, {});
            return Object.assign(Object.assign({}, result), { 
                // @ts-ignore
                items: result.items.map((i) => postMap(i, userId)) });
        });
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            let row = yield base_repositry_1.baseRepositry.findById(this.Post, id, {});
            if (!row)
                return false;
            return postMap(row, userId);
        });
    }
};
PostsQueryRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PostsQueryRepo);
exports.PostsQueryRepo = PostsQueryRepo;
function postMap(i, userId) {
    var _a, _b;
    const userStatus = (_a = i.extendedLikesInfo) === null || _a === void 0 ? void 0 : _a.newestLikes.find((u) => u.userId === userId);
    const myStatus = userStatus ? userStatus.status : baseTypes_1.Likes.NONE;
    if (myStatus === baseTypes_1.Likes.NONE) {
        console.log('userId', userId);
        console.log('userStatus', userStatus);
    }
    const newestLikes = (_b = i.extendedLikesInfo) === null || _b === void 0 ? void 0 : _b.newestLikes.filter((i) => i.status === baseTypes_1.Likes.LIKE && i.userId !== userId).map((i) => {
        return {
            addedAt: i.addedAt,
            userId: i.userId,
            login: i.login,
        };
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
    };
}
let PostsCommandRepo = class PostsCommandRepo {
    constructor() {
        this.Post = posts_models_1.Post;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdRow = yield this.Post.create(user);
            return String(createdRow._id);
        });
    }
    update(id, userPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(null);
            const createdRow = yield this.Post.findByIdAndUpdate({ _id: id }, userPayload);
            return createdRow ? String(createdRow._id) : null;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.Post.deleteMany();
            return result.deletedCount > 0;
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            const result = yield this.Post.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
};
PostsCommandRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PostsCommandRepo);
exports.PostsCommandRepo = PostsCommandRepo;
