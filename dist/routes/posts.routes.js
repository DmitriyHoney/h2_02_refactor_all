"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_composition_1 = __importDefault(require("../composition/posts.composition"));
const posts_controllers_1 = require("../controllers/posts.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const middlewares_1 = require("../middlewares");
const posts_middlewares_1 = require("../middlewares/posts.middlewares");
const postsComments_middlewares_1 = require("../middlewares/postsComments.middlewares");
const postControllers = posts_composition_1.default.resolve(posts_controllers_1.PostsControllers);
const router = (0, express_1.Router)();
router.get('/', auth_middlewares_1.authJwtMiddleware, postControllers.getAll.bind(postControllers));
router.post('/', auth_middlewares_1.basicAuthMiddleware, ...posts_middlewares_1.createPostsBody, middlewares_1.validatorsErrorsMiddleware, postControllers.create.bind(postControllers));
router.get('/:id', auth_middlewares_1.authJwtMiddleware, postControllers.getOne.bind(postControllers));
router.put('/:id', auth_middlewares_1.basicAuthMiddleware, ...posts_middlewares_1.createPostsBody, middlewares_1.validatorsErrorsMiddleware, postControllers.update.bind(postControllers));
router.delete('/:id', auth_middlewares_1.basicAuthMiddleware, postControllers.deleteOne.bind(postControllers));
router.get('/:id/comments/', auth_middlewares_1.authJwtMiddleware, postControllers.getComments.bind(postControllers));
router.post('/:id/comments/', auth_middlewares_1.authJwtAccessMiddleware, ...postsComments_middlewares_1.createPostsCommentsBody, middlewares_1.validatorsErrorsMiddleware, postControllers.createComment.bind(postControllers));
router.put('/:id/like-status/', auth_middlewares_1.authJwtAccessMiddleware, ...posts_middlewares_1.createPostsLikeBody, middlewares_1.validatorsErrorsMiddleware, postControllers.likeUnlikePost.bind(postControllers));
exports.default = router;
//# sourceMappingURL=posts.routes.js.map