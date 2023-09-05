"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_composition_1 = __importDefault(require("../composition/users.composition"));
const user_controllers_1 = require("../controllers/user.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const middlewares_1 = require("../middlewares");
const userControllers = users_composition_1.default.resolve(user_controllers_1.UsersControllers);
const router = (0, express_1.Router)();
router.get('/', auth_middlewares_1.basicAuthMiddleware, userControllers.getAll.bind(userControllers));
router.post('/', auth_middlewares_1.basicAuthMiddleware, ...users_middlewares_1.userPostBody, middlewares_1.validatorsErrorsMiddleware, userControllers.create.bind(userControllers));
router.delete('/:id', auth_middlewares_1.basicAuthMiddleware, userControllers.deleteOne.bind(userControllers));
exports.default = router;
//# sourceMappingURL=users.routes.js.map