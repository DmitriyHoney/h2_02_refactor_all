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
exports.SecurityDeviceCommandRepo = exports.SecurityDeviceQueryRepo = void 0;
const inversify_1 = require("inversify");
const base_repositry_1 = require("./base.repositry");
const sessions_models_1 = require("../models/sessions.models");
const node_crypto_1 = require("node:crypto");
let SecurityDeviceQueryRepo = class SecurityDeviceQueryRepo {
    constructor() {
        this.Session = sessions_models_1.Session;
    }
    find(params, filters) {
        return base_repositry_1.baseRepositry.find(this.Session, params, filters, {});
    }
    findByDeviceId(deviceId) {
        return base_repositry_1.baseRepositry.findByFields(this.Session, { deviceId });
    }
};
SecurityDeviceQueryRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SecurityDeviceQueryRepo);
exports.SecurityDeviceQueryRepo = SecurityDeviceQueryRepo;
let SecurityDeviceCommandRepo = class SecurityDeviceCommandRepo {
    constructor() {
        this.Session = sessions_models_1.Session;
    }
    create(userId, ip, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdRow = yield this.Session.create({
                userId,
                ip,
                title,
                deviceId: (0, node_crypto_1.randomUUID)()
            });
            return String(createdRow._id);
        });
    }
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.Session.deleteOne({ deviceId });
            return deleted.deletedCount > 0;
        });
    }
    deleteByFields(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.Session.deleteOne(fields);
            return deleted.deletedCount > 0;
        });
    }
    deleteAllUserDevice(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.Session.deleteMany({ userId });
            return deleted.deletedCount > 0;
        });
    }
    deleteAllDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.Session.deleteMany();
            return deleted.deletedCount > 0;
        });
    }
};
SecurityDeviceCommandRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SecurityDeviceCommandRepo);
exports.SecurityDeviceCommandRepo = SecurityDeviceCommandRepo;
