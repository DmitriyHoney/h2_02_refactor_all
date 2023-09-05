"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.sessionsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
exports.sessionsSchema = new Schema({
    ip: String,
    title: String,
    lastActiveDate: {
        type: Date,
        required: false,
    },
    deviceId: String,
    userId: String,
}, { timestamps: true });
exports.sessionsSchema.method('toJSON', function () {
    // @ts-ignore
    const _a = this.toObject(), { __v, _id } = _a, object = __rest(_a, ["__v", "_id"]);
    object.id = _id;
    delete object._id;
    delete object.__v;
    return object;
});
exports.sessionsSchema.pre('save', function (next) {
    this.lastActiveDate = new Date();
    next();
});
exports.Session = mongoose_1.default.model('Session', exports.sessionsSchema);
//# sourceMappingURL=sessions.models.js.map