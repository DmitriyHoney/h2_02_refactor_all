"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../config/settings");
exports.jwtService = {
    createJWT(payload, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, settings_1.settings.JWT_SECRET, { expiresIn });
    },
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    },
};
//# sourceMappingURL=jwt.manager.js.map