import { body } from 'express-validator';
import { VALIDATION_ERROR_MSG } from '../config/baseTypes';
import { isEmail, isLogin } from '../helpers';

export const createAndUpdateBlogsBody = [
    body('name')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 15 }).withMessage(VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    body('description')
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 500 }).withMessage(VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    body('websiteUrl')
        .trim()
        .notEmpty().withMessage(VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isURL().withMessage(VALIDATION_ERROR_MSG.IS_URL).bail()
        .isLength({ min: 2, max: 100 })
]