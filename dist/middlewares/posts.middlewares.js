"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostsLikeBody = exports.createPostsBody = void 0;
const express_validator_1 = require("express-validator");
const baseTypes_1 = require("../config/baseTypes");
const blogs_composition_1 = __importDefault(require("../composition/blogs.composition"));
const blogs_services_1 = require("../services/blogs.services");
const blogsService = blogs_composition_1.default.resolve(blogs_services_1.BlogsService);
exports.createPostsBody = [
    (0, express_validator_1.body)('title')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 30 }).withMessage(baseTypes_1.VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    (0, express_validator_1.body)('shortDescription')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 100 }).withMessage(baseTypes_1.VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    (0, express_validator_1.body)('content')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 1000 }).withMessage(baseTypes_1.VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    (0, express_validator_1.body)('blogId')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom((v, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const isExist = yield blogsService.blogsQueryRepo.findById(req.body.blogId);
        if (!isExist)
            throw new Error(baseTypes_1.VALIDATION_ERROR_MSG.BLOG_ID_NOT_FOUND);
        return true;
    })),
    (0, express_validator_1.body)('blogName')
        .optional()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail(),
];
exports.createPostsLikeBody = [
    (0, express_validator_1.body)('likeStatus')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom((v, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const isReqStrValid = [baseTypes_1.Likes.NONE, baseTypes_1.Likes.LIKE, baseTypes_1.Likes.DISLIKE].includes(req.body.likeStatus);
        if (!isReqStrValid)
            throw new Error(baseTypes_1.VALIDATION_ERROR_MSG.OUT_OF_RANGE);
        return true;
    })),
];
