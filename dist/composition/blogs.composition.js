"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const blogs_controllers_1 = require("../controllers/blogs.controllers");
const blogs_services_1 = require("../services/blogs.services");
const blogs_repositry_1 = require("../repositry/blogs.repositry");
const posts_services_1 = require("../services/posts.services");
const posts_repositry_1 = require("../repositry/posts.repositry");
const container = new inversify_1.Container();
container.bind(blogs_controllers_1.BlogsControllers).to(blogs_controllers_1.BlogsControllers);
container.bind(blogs_services_1.BlogsService).to(blogs_services_1.BlogsService);
container.bind(posts_services_1.PostsService).to(posts_services_1.PostsService);
container.bind(posts_repositry_1.PostsQueryRepo).to(posts_repositry_1.PostsQueryRepo);
container.bind(posts_repositry_1.PostsCommandRepo).to(posts_repositry_1.PostsCommandRepo);
container.bind(blogs_repositry_1.BlogsQueryRepo).to(blogs_repositry_1.BlogsQueryRepo);
container.bind(blogs_repositry_1.BlogsCommandRepo).to(blogs_repositry_1.BlogsCommandRepo);
exports.default = container;
//# sourceMappingURL=blogs.composition.js.map