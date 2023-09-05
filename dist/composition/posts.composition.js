"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const posts_controllers_1 = require("../controllers/posts.controllers");
const posts_services_1 = require("../services/posts.services");
const posts_repositry_1 = require("../repositry/posts.repositry");
const postsComments_services_1 = require("../services/postsComments.services");
const postsComments_repositry_1 = require("../repositry/postsComments.repositry");
const blogs_repositry_1 = require("../repositry/blogs.repositry");
const container = new inversify_1.Container();
container.bind(posts_controllers_1.PostsControllers).to(posts_controllers_1.PostsControllers);
container.bind(posts_services_1.PostsService).to(posts_services_1.PostsService);
container.bind(postsComments_services_1.PostsCommentsService).to(postsComments_services_1.PostsCommentsService);
container.bind(postsComments_repositry_1.PostsCommentsQueryRepo).to(postsComments_repositry_1.PostsCommentsQueryRepo);
container.bind(postsComments_repositry_1.PostsCommentsCommandRepo).to(postsComments_repositry_1.PostsCommentsCommandRepo);
container.bind(posts_repositry_1.PostsQueryRepo).to(posts_repositry_1.PostsQueryRepo);
container.bind(blogs_repositry_1.BlogsQueryRepo).to(blogs_repositry_1.BlogsQueryRepo);
container.bind(posts_repositry_1.PostsCommandRepo).to(posts_repositry_1.PostsCommandRepo);
exports.default = container;
//# sourceMappingURL=posts.composition.js.map