"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogs_composition_1 = __importDefault(require("../composition/blogs.composition"));
const blogs_controllers_1 = require("../controllers/blogs.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const middlewares_1 = require("../middlewares");
const blogs_middlewares_1 = require("../middlewares/blogs.middlewares");
const posts_middlewares_1 = require("../middlewares/posts.middlewares");
const blogControllers = blogs_composition_1.default.resolve(blogs_controllers_1.BlogsControllers);
const router = (0, express_1.Router)();
router.get('/', blogControllers.getAll.bind(blogControllers));
router.post('/', auth_middlewares_1.basicAuthMiddleware, ...blogs_middlewares_1.createAndUpdateBlogsBody, middlewares_1.validatorsErrorsMiddleware, blogControllers.create.bind(blogControllers));
router.get('/:id', blogControllers.getOne.bind(blogControllers));
router.put('/:id', auth_middlewares_1.basicAuthMiddleware, ...blogs_middlewares_1.createAndUpdateBlogsBody, middlewares_1.validatorsErrorsMiddleware, blogControllers.update.bind(blogControllers));
router.delete('/:id', auth_middlewares_1.basicAuthMiddleware, blogControllers.deleteOne.bind(blogControllers));
router.get('/:id/posts', auth_middlewares_1.authJwtMiddleware, blogControllers.getPostsForBlog.bind(blogControllers));
router.post('/:id/posts', auth_middlewares_1.basicAuthMiddleware, ...posts_middlewares_1.createPostFromBlogUrlBody, middlewares_1.validatorsErrorsMiddleware, blogControllers.createPostForBlog.bind(blogControllers));
exports.default = router;
//# sourceMappingURL=blogs.routes.js.map