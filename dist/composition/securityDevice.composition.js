"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const securityDevice_controllers_1 = require("../controllers/securityDevice.controllers");
const securityDevice_services_1 = require("../services/securityDevice.services");
const securityDevice_repositry_1 = require("../repositry/securityDevice.repositry");
const securityDeviceContainer = new inversify_1.Container();
securityDeviceContainer.bind(securityDevice_controllers_1.SecurityDeviceControllers).to(securityDevice_controllers_1.SecurityDeviceControllers);
securityDeviceContainer.bind(securityDevice_services_1.SecurityDeviceService).to(securityDevice_services_1.SecurityDeviceService);
securityDeviceContainer.bind(securityDevice_repositry_1.SecurityDeviceQueryRepo).to(securityDevice_repositry_1.SecurityDeviceQueryRepo);
securityDeviceContainer.bind(securityDevice_repositry_1.SecurityDeviceCommandRepo).to(securityDevice_repositry_1.SecurityDeviceCommandRepo);
exports.default = securityDeviceContainer;
//# sourceMappingURL=securityDevice.composition.js.map