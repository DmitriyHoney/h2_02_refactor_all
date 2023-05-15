"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const settings_1 = require("./config/settings");
const dataBase_1 = require("./config/dataBase");
app_1.default.listen(settings_1.settings.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dataBase_1.connectDB)(settings_1.settings.DB_NAME);
        console.log(`http://localhost:${settings_1.settings.PORT}`);
    }
    catch (e) {
        console.error(e);
    }
}));
