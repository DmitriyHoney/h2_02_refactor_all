"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityDeviceControllers = void 0;
const inversify_1 = require("inversify");
const securityDevice_services_1 = require("../services/securityDevice.services");
const baseTypes_1 = require("../config/baseTypes");
let SecurityDeviceControllers = class SecurityDeviceControllers {
    constructor(securityDeviceService) {
        this.securityDeviceService = securityDeviceService;
    }
    getAllUserDevices(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
            const result = yield this.securityDeviceService.securityDeviceQueryRepo.find({ pageSize, pageNumber, sortBy, sortDirection }, { userId: (_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id });
            res.status(baseTypes_1.HTTP_STATUSES.OK_200).send(result);
        });
    }
    deleteUserDeviceById(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const dId = req.params.deviceId;
            const findDevice = yield this.securityDeviceService.securityDeviceQueryRepo.findByDeviceId(dId);
            if (!findDevice)
                return res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send();
            if (findDevice.userId !== ((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id))
                return res.status(baseTypes_1.HTTP_STATUSES.FORBIDDEN_403).send();
            yield this.securityDeviceService.deleteByDeviceId(dId);
            return res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
    deleteAllUserDecices(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.securityDeviceService.deleteAllUserDevice((_b = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            return res.status(baseTypes_1.HTTP_STATUSES.NO_CONTENT_204).send();
        });
    }
};
SecurityDeviceControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(securityDevice_services_1.SecurityDeviceService)),
    __metadata("design:paramtypes", [securityDevice_services_1.SecurityDeviceService])
], SecurityDeviceControllers);
exports.SecurityDeviceControllers = SecurityDeviceControllers;
