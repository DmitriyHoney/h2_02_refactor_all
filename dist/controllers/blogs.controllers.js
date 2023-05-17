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
exports.BlogsControllers = void 0;
const inversify_1 = require("inversify");
const blogs_services_1 = require("../services/blogs.services");
const baseTypes_1 = require("../config/baseTypes");
const helpers_1 = require("../helpers");
const posts_services_1 = require("../services/posts.services");
let BlogsControllers = class BlogsControllers {
    constructor(blogsService, postsService) {
        this.blogsService = blogsService;
        this.postsService = postsService;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
            const result = yield this.blogsService.blogsQueryRepo.find({ pageSize, pageNumber, sortBy, sortDirection }, {});
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogsService.blogsQueryRepo.findById(req.params.id);
            if (!result)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = yield this.blogsService.create(req.body);
                const blog = yield this.blogsService.blogsQueryRepo.findById(blogId);
                res.status(baseTypes_1.HTTP_STATUSES.CREATED_201).send(blog);
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
                const isUpdated = yield this.blogsService.update(req.params.id, req.body);
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
            const isWasDeleted = yield this.blogsService.deleteOne(req.params.id);
            if (!isWasDeleted)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    getPostsForBlog(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsService.blogsQueryRepo.findById(req.params.id);
            if (!blog)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send({});
            const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
            const result = yield this.postsService.postsQueryRepo.find((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, { pageSize, pageNumber, sortBy, sortDirection }, { blogId: req.params.id });
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    createPostForBlog(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsService.blogsQueryRepo.findById(req.params.id);
            if (!blog)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send({});
            const createdPostId = yield this.postsService.create(Object.assign(Object.assign({}, req.body), { blogId: req.params.id }));
            const post = yield this.postsService.postsQueryRepo.findById(createdPostId, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            return res.status(baseTypes_1.HTTP_STATUSES.CREATED_201).send(post);
        });
    }
};
BlogsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_services_1.BlogsService)),
    __param(1, (0, inversify_1.inject)(posts_services_1.PostsService)),
    __metadata("design:paramtypes", [blogs_services_1.BlogsService,
        posts_services_1.PostsService])
], BlogsControllers);
exports.BlogsControllers = BlogsControllers;
