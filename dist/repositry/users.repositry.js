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
exports.UsersCommandRepo = exports.UsersQueryRepo = void 0;
const inversify_1 = require("inversify");
const users_models_1 = require("../models/users.models");
const base_repositry_1 = require("./base.repositry");
const mongodb_1 = require("mongodb");
let UsersQueryRepo = class UsersQueryRepo {
    constructor() {
        this.User = users_models_1.User;
    }
    find(params, filters) {
        const prepareFilters = { $or: [] };
        if (filters.searchLoginTerm)
            prepareFilters.$or.push({ login: { $regex: filters.searchLoginTerm, $options: "i" } });
        if (filters.searchEmailTerm)
            prepareFilters.$or.push({ email: { $regex: filters.searchEmailTerm, $options: "i" } });
        return base_repositry_1.baseRepositry.find(this.User, params, prepareFilters, { password: 0 });
    }
    findByEmail(email) {
        return base_repositry_1.baseRepositry.findByFields(this.User, { email: email }, {});
    }
    findByLogin(login) {
        return base_repositry_1.baseRepositry.findByFields(this.User, { login: login }, {});
    }
    findByConfirmCode(code) {
        return base_repositry_1.baseRepositry.findByFields(this.User, { 'confirmedInfo.code': code }, {});
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield base_repositry_1.baseRepositry.findById(this.User, userId, {
                confirmedInfo: 0,
                password: 0,
                updatedAt: 0,
            });
        });
    }
    meInfoById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield base_repositry_1.baseRepositry.findById(this.User, userId, {});
            if (!user)
                return null;
            return {
                email: user.email,
                login: user.login,
                userId: user.id,
            };
        });
    }
};
UsersQueryRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UsersQueryRepo);
exports.UsersQueryRepo = UsersQueryRepo;
let UsersCommandRepo = class UsersCommandRepo {
    constructor() {
        this.User = users_models_1.User;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdRow = yield this.User.create(user);
            return String(createdRow._id);
        });
    }
    update(id, userPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(null);
            const createdRow = yield this.User.findByIdAndUpdate({ _id: id }, userPayload);
            return createdRow ? String(createdRow._id) : null;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.User.deleteMany();
            return result.deletedCount > 0;
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            const result = yield this.User.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
};
UsersCommandRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UsersCommandRepo);
exports.UsersCommandRepo = UsersCommandRepo;
