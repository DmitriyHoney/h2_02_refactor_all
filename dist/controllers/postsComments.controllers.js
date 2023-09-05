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
exports.PostsCommentsControllers = void 0;
const inversify_1 = require("inversify");
const baseTypes_1 = require("../config/baseTypes");
const helpers_1 = require("../helpers");
const postsComments_services_1 = require("../services/postsComments.services");
let PostsCommentsControllers = class PostsCommentsControllers {
    constructor(postsCommentsService) {
        this.postsCommentsService = postsCommentsService;
    }
    getAll(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
            const result = yield this.postsCommentsService.postsCommentsQueryRepo.find((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id, { pageSize, pageNumber, sortBy, sortDirection }, {});
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    getOne(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!result)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    create(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = yield this.postsCommentsService.create(req.context.user, req.params.id, req.body);
                const blog = yield this.postsCommentsService.postsCommentsQueryRepo.findById(blogId, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
                res.status(baseTypes_1.HTTP_STATUSES.CREATED_201).send(blog);
            }
            catch (e) {
                const error = e;
                return res.status(baseTypes_1.HTTP_STATUSES.BAD_REQUEST_400).send((0, helpers_1.checkMongooseErrorsOnDuplicateKey)(error));
            }
        });
    }
    update(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
                if (!comment)
                    return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
                // @ts-ignore
                if (comment && comment.commentatorInfo.userId !== ((_d = (_c = req === null || req === void 0 ? void 0 : req.context) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id))
                    return res.status(baseTypes_1.HTTP_STATUSES.FORBIDDEN_403).send();
                const isUpdated = yield this.postsCommentsService.update(req.params.id, req.body);
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
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!comment)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            // @ts-ignore
            if (comment.commentatorInfo.userId !== ((_d = (_c = req === null || req === void 0 ? void 0 : req.context) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id))
                return res.status(baseTypes_1.HTTP_STATUSES.FORBIDDEN_403).send();
            const isWasDeleted = yield this.postsCommentsService.deleteOne(req.params.id);
            if (!isWasDeleted)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    likeUnlikeComment(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!comment)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            // @ts-ignore
            yield this.postsCommentsService.likeUnlikeComment(req.params.id, req.body.likeStatus, comment, (_d = (_c = req === null || req === void 0 ? void 0 : req.context) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id);
            res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
};
PostsCommentsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(postsComments_services_1.PostsCommentsService)),
    __metadata("design:paramtypes", [postsComments_services_1.PostsCommentsService])
], PostsCommentsControllers);
exports.PostsCommentsControllers = PostsCommentsControllers;
//# sourceMappingURL=postsComments.controllers.js.map