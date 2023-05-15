"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const securityDevice_composition_1 = __importDefault(require("../composition/securityDevice.composition"));
const securityDevice_controllers_1 = require("../controllers/securityDevice.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const securityDeviceControllers = securityDevice_composition_1.default.resolve(securityDevice_controllers_1.SecurityDeviceControllers);
const router = (0, express_1.Router)();
router.get('/', auth_middlewares_1.authJwtMiddleware, securityDeviceControllers.getAllUserDevices.bind(securityDeviceControllers));
router.delete('/', auth_middlewares_1.authJwtMiddleware, securityDeviceControllers.deleteAllUserDecices.bind(securityDeviceControllers));
router.delete('/:deviceId', auth_middlewares_1.authJwtMiddleware, securityDeviceControllers.deleteUserDeviceById.bind(securityDeviceControllers));
exports.default = router;
