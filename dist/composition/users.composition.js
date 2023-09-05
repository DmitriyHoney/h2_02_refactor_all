"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const user_controllers_1 = require("../controllers/user.controllers");
const users_services_1 = require("../services/users.services");
const users_repositry_1 = require("../repositry/users.repositry");
const usersContainer = new inversify_1.Container();
usersContainer.bind(user_controllers_1.UsersControllers).to(user_controllers_1.UsersControllers);
usersContainer.bind(users_services_1.UsersService).to(users_services_1.UsersService);
usersContainer.bind(users_repositry_1.UsersQueryRepo).to(users_repositry_1.UsersQueryRepo);
usersContainer.bind(users_repositry_1.UsersCommandRepo).to(users_repositry_1.UsersCommandRepo);
exports.default = usersContainer;
//# sourceMappingURL=users.composition.js.map