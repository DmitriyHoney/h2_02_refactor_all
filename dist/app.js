"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Routes
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const securityDevice_routes_1 = __importDefault(require("./routes/securityDevice.routes"));
const blogs_routes_1 = __importDefault(require("./routes/blogs.routes"));
const posts_routes_1 = __importDefault(require("./routes/posts.routes"));
const postComments_routes_1 = __importDefault(require("./routes/postComments.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const baseTypes_1 = require("./config/baseTypes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
var num = 0;
app.use(function (req, res, next) {
    var method = req.method;
    var url = req.url;
    console.log((++num) + " " + method + " " + url);
    next();
});
app.set('trust proxy', true);
app.use('/api/users', users_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/security/devices', securityDevice_routes_1.default);
app.use('/api/blogs', blogs_routes_1.default);
app.use('/api/posts', posts_routes_1.default);
app.use('/api/comments', postComments_routes_1.default);
app.use('/api/testing/all-data', test_routes_1.default);
app.get('*', (req, res) => res.status(baseTypes_1.HTTP_STATUSES.NOT_FOUND_404).send('Not found'));
exports.default = app;
//# sourceMappingURL=app.js.map