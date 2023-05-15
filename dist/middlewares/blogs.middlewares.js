"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndUpdateBlogsBody = void 0;
const express_validator_1 = require("express-validator");
const baseTypes_1 = require("../config/baseTypes");
exports.createAndUpdateBlogsBody = [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 15 }).withMessage(baseTypes_1.VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    (0, express_validator_1.body)('description')
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isString().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_STRING).bail()
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isLength({ min: 2, max: 500 }).withMessage(baseTypes_1.VALIDATION_ERROR_MSG.OUT_OF_RANGE),
    (0, express_validator_1.body)('websiteUrl')
        .trim()
        .notEmpty().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.REQUIRED).bail()
        .isURL().withMessage(baseTypes_1.VALIDATION_ERROR_MSG.IS_URL).bail()
        .isLength({ min: 2, max: 100 })
];
