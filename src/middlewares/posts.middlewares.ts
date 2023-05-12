import { body } from 'express-validator';
import {Likes, VALIDATION_ERROR_MSG} from '../config/baseTypes';
import container from '../composition/blogs.composition';
import {BlogsService} from "../services/blogs.services";

const blogsService = container.resolve(BlogsService);
export const createPostsBody = [
    body('title')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 30 }).withMessage(VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    body('shortDescription')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 100 }).withMessage(VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    body('content')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 1000 }).withMessage(VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    body('blogId')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom(async (v, { req }) => {
            const isExist = await blogsService.blogsQueryRepo.findById(req.body.blogId);
            if (!isExist) throw new Error(VALIDATION_ERROR_MSG.BLOG_ID_NOT_FOUND);
            return true;
        }),
    body('blogName')
        .optional()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail(),
]

export const createPostsLikeBody = [
    body('likeStatus')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .custom(async (v, { req }) => {
            const isReqStrValid = [Likes.NONE, Likes.LIKE, Likes.DISLIKE].includes(req.body.likeStatus);
            if (!isReqStrValid) throw new Error(VALIDATION_ERROR_MSG.OUT_OF_RANGE);
            return true;
        }),
]