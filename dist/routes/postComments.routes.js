"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postsComments_composition_1 = __importDefault(require("../composition/postsComments.composition"));
const postsComments_controllers_1 = require("../controllers/postsComments.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const postsComments_middlewares_1 = require("../middlewares/postsComments.middlewares");
const middlewares_1 = require("../middlewares");
const controllers = postsComments_composition_1.default.resolve(postsComments_controllers_1.PostsCommentsControllers);
const router = (0, express_1.Router)();
router.get('/:id', auth_middlewares_1.authJwtMiddleware, controllers.getOne.bind(controllers));
router.put('/:id', auth_middlewares_1.authJwtAccessMiddleware, ...postsComments_middlewares_1.createPostsCommentsBody, middlewares_1.validatorsErrorsMiddleware, controllers.update.bind(controllers));
router.delete('/:id', auth_middlewares_1.authJwtAccessMiddleware, controllers.deleteOne.bind(controllers));
router.put('/:id/like-status', auth_middlewares_1.authJwtAccessMiddleware, ...postsComments_middlewares_1.createLikeForCommentBody, middlewares_1.validatorsErrorsMiddleware, controllers.likeUnlikeComment.bind(controllers));
exports.default = router;
