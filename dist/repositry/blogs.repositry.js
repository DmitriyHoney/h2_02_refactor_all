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
exports.BlogsCommandRepo = exports.BlogsQueryRepo = void 0;
const inversify_1 = require("inversify");
const blogs_models_1 = require("../models/blogs.models");
const base_repositry_1 = require("./base.repositry");
const mongodb_1 = require("mongodb");
let BlogsQueryRepo = class BlogsQueryRepo {
    constructor() {
        this.Blog = blogs_models_1.Blog;
    }
    find(params, filters) {
        return base_repositry_1.baseRepositry.find(this.Blog, params, filters, {});
    }
    findByEmail(email) {
        return base_repositry_1.baseRepositry.findByFields(this.Blog, { email: email }, {});
    }
    findByLogin(login) {
        return base_repositry_1.baseRepositry.findByFields(this.Blog, { login: login }, {});
    }
    findByConfirmCode(code) {
        return base_repositry_1.baseRepositry.findByFields(this.Blog, { 'confirmedInfo.code': code }, {});
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            return yield base_repositry_1.baseRepositry.findById(this.Blog, id, {});
        });
    }
};
BlogsQueryRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BlogsQueryRepo);
exports.BlogsQueryRepo = BlogsQueryRepo;
let BlogsCommandRepo = class BlogsCommandRepo {
    constructor() {
        this.Blog = blogs_models_1.Blog;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdRow = yield this.Blog.create(user);
            return String(createdRow._id);
        });
    }
    update(id, userPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(null);
            const createdRow = yield this.Blog.findByIdAndUpdate({ _id: id }, userPayload);
            return createdRow ? String(createdRow._id) : null;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.Blog.deleteMany();
            return result.deletedCount > 0;
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return Promise.resolve(false);
            const result = yield this.Blog.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
};
BlogsCommandRepo = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BlogsCommandRepo);
exports.BlogsCommandRepo = BlogsCommandRepo;
