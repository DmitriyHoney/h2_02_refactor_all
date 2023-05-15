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
exports.PostsControllers = void 0;
const inversify_1 = require("inversify");
const posts_services_1 = require("../services/posts.services");
const baseTypes_1 = require("../config/baseTypes");
const helpers_1 = require("../helpers");
const postsComments_services_1 = require("../services/postsComments.services");
let PostsControllers = class PostsControllers {
    constructor(postsService, postsCommentsService) {
        this.postsService = postsService;
        this.postsCommentsService = postsCommentsService;
    }
    getAll(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
            const result = yield this.postsService.postsQueryRepo.find((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, { pageSize, pageNumber, sortBy, sortDirection }, {});
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    getOne(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.postsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!result)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    create(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = yield this.postsService.create(req.body);
                const post = yield this.postsService.postsQueryRepo.findById(postId, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
                res.status(baseTypes_1.HTTP_STATUSES.CREATED_201).send(post);
            }
            catch (e) {
                const error = e;
                return res.status(baseTypes_1.HTTP_STATUSES.BAD_REQUEST_400).send((0, helpers_1.checkMongooseErrorsOnDuplicateKey)(error));
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUpdated = yield this.postsService.update(req.params.id, req.body);
                if (!isUpdated)
                    return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
                return res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send({});
            }
            catch (e) {
                const error = e;
                return res.status(baseTypes_1.HTTP_STATUSES.BAD_REQUEST_400).send((0, helpers_1.checkMongooseErrorsOnDuplicateKey)(error));
            }
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isWasDeleted = yield this.postsService.deleteOne(req.params.id);
            if (!isWasDeleted)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    createComment(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.postsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!result)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            // @ts-ignore
            const commentId = yield this.postsCommentsService.create(req.context.user, result.id, req.body);
            const comment = yield this.postsCommentsService.postsCommentsQueryRepo.findById(commentId, (_d = (_c = req === null || req === void 0 ? void 0 : req.context) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id);
            res.status(baseTypes_1.HTTP_STATUSES.CREATED_201).send(comment);
        });
    }
    getComments(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.postsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!result)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
            const comment = yield this.postsCommentsService.postsCommentsQueryRepo.find((_d = (_c = req === null || req === void 0 ? void 0 : req.context) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id, { pageSize, pageNumber, sortBy, sortDirection }, { postId: req.params.id });
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(comment);
        });
    }
    likeUnlikePost(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsService.postsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!post)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            // @ts-ignore
            yield this.postsService.likeUnlikePost(req.params.id, req.body.likeStatus, post, req.context.user);
            res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
};
PostsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_services_1.PostsService)),
    __param(1, (0, inversify_1.inject)(postsComments_services_1.PostsCommentsService)),
    __metadata("design:paramtypes", [posts_services_1.PostsService,
        postsComments_services_1.PostsCommentsService])
], PostsControllers);
exports.PostsControllers = PostsControllers;
