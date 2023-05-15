"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_composition_1 = __importDefault(require("../composition/users.composition"));
const securityDevice_composition_1 = __importDefault(require("../composition/securityDevice.composition"));
const blogs_composition_1 = __importDefault(require("../composition/blogs.composition"));
const posts_composition_1 = __importDefault(require("../composition/posts.composition"));
const users_services_1 = require("../services/users.services");
const baseTypes_1 = require("../config/baseTypes");
const securityDevice_services_1 = require("../services/securityDevice.services");
const blogs_services_1 = require("../services/blogs.services");
const posts_services_1 = require("../services/posts.services");
const postsComments_services_1 = require("../services/postsComments.services");
const router = (0, express_1.Router)();
const userService = users_composition_1.default.resolve(users_services_1.UsersService);
const deviceService = securityDevice_composition_1.default.resolve(securityDevice_services_1.SecurityDeviceService);
const blogService = blogs_composition_1.default.resolve(blogs_services_1.BlogsService);
const postService = posts_composition_1.default.resolve(posts_services_1.PostsService);
const postsCommentsService = posts_composition_1.default.resolve(postsComments_services_1.PostsCommentsService);
router.delete('/', (req, res) => {
    Promise.all([
        blogService.deleteAll(),
        postService.deleteAll(),
        userService.deleteAll(),
        deviceService.deleteAllDevice(),
        postsCommentsService.deleteAll(),
    ]).then((result) => {
        res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
    }).catch((err) => {
        res.status(baseTypes_1.HTTP_STATUSES.SERVER_ERROR_500).send();
    });
});
exports.default = router;
