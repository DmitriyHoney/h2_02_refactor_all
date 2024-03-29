"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const postsComments_controllers_1 = require("../controllers/postsComments.controllers");
const postsComments_services_1 = require("../services/postsComments.services");
const postsComments_repositry_1 = require("../repositry/postsComments.repositry");
const container = new inversify_1.Container();
container.bind(postsComments_controllers_1.PostsCommentsControllers).to(postsComments_controllers_1.PostsCommentsControllers);
container.bind(postsComments_services_1.PostsCommentsService).to(postsComments_services_1.PostsCommentsService);
container.bind(postsComments_repositry_1.PostsCommentsQueryRepo).to(postsComments_repositry_1.PostsCommentsQueryRepo);
container.bind(postsComments_repositry_1.PostsCommentsCommandRepo).to(postsComments_repositry_1.PostsCommentsCommandRepo);
exports.default = container;
//# sourceMappingURL=postsComments.composition.js.map