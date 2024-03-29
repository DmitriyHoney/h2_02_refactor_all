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
exports.PostsCommentsCommandRepo = exports.PostsCommentsQueryRepo = void 0;
const inversify_1 = require("inversify");
const postsComments_models_1 = require("../models/postsComments.models");
const baseTypes_1 = require("../config/baseTypes");
const base_repositry_1 = require("./base.repositry");
const mongodb_1 = require("mongodb");
let PostsCommentsQueryRepo = class PostsCommentsQueryRepo {
    constructor() {
        this.PostComment = postsComments_models_1.PostComment;
    }
    find(userId, params, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield base_repositry_1.baseRepositry.find(this.PostComment, params, filters, {});
            return Object.assign(Object.assign({}, result), { 
                // @ts-ignore
                items: result.items.map((i) => commentMap(i, userId)) });
        });
    }
    findByEmail(email) {
        return base_repositry_1.baseRepositry.findByFields(this.PostComment, { email: email }, {});
    }
    findByLogin(login) {
        return base_repositry_1.baseRepositry.findByFields(this.PostComment, { login: login }, {});
    }
    findByConfirmCode(code) {
        return base_repositry_1.baseRepositry.findByFields(this.PostComment, { 'confirmedInfo.code': code }, {});
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            let row = yield base_repositry_1.baseRepositry.findById(this.PostComment, id, {});
            if (!row)
                return false;
            return commentMap(row, userId);
        });
    }
};
PostsCommentsQueryRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PostsCommentsQueryRepo);
exports.PostsCommentsQueryRepo = PostsCommentsQueryRepo;
function commentMap(i, userId) {
    var _a, _b;
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
            myStatus: userId && ((_a = i.likesInfo) === null || _a === void 0 ? void 0 : _a.usersStatistics[userId]) ? (_b = i.likesInfo) === null || _b === void 0 ? void 0 : _b.usersStatistics[userId] : baseTypes_1.Likes.NONE
        }
    };
}
let PostsCommentsCommandRepo = class PostsCommentsCommandRepo {
    constructor() {
        this.PostComment = postsComments_models_1.PostComment;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdRow = yield this.PostComment.create(user);
            return String(createdRow._id);
        });
    }
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(null);
            const createdRow = yield this.PostComment.findByIdAndUpdate({ _id: id }, payload);
            return createdRow ? String(createdRow._id) : null;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.PostComment.deleteMany();
            return result.deletedCount > 0;
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            const result = yield this.PostComment.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
};
PostsCommentsCommandRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PostsCommentsCommandRepo);
exports.PostsCommentsCommandRepo = PostsCommentsCommandRepo;
//# sourceMappingURL=postsComments.repositry.js.map