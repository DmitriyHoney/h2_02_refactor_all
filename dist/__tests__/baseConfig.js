"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configForTests = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
exports.configForTests = {
    urls: {
        users: '/api/users/',
        deleteAll: '/api/testing/all-data/',
    },
    basicToken: 'Basic YWRtaW46cXdlcnR5',
    incorrectBasicToken: 'Basic YWRtaW46cXdlcnT6',
    server: null,
    app: app_1.default,
    reqWithAuthHeader(method, url, token) {
        // TODO: remove //@ts-ignore
        // @ts-ignore
        return (0, supertest_1.default)(app_1.default)[method](url).set('Authorization', token);
    }
};
