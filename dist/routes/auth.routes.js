"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_composition_1 = __importDefault(require("../composition/auth.composition"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const middlewares_1 = require("../middlewares");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const authControllers = auth_composition_1.default.resolve(auth_controllers_1.AuthControllers);
const router = (0, express_1.Router)();
router.post('/registration', (0, auth_middlewares_1.rateLimiterUsingThirdParty)(), ...users_middlewares_1.userPostBody, middlewares_1.validatorsErrorsMiddleware, authControllers.registration.bind(authControllers));
router.post('/registration-email-resending', (0, auth_middlewares_1.rateLimiterUsingThirdParty)(), ...auth_middlewares_1.registrationResendingEmailBody, middlewares_1.validatorsErrorsMiddleware, authControllers.registrationResendEmail.bind(authControllers));
router.post('/registration-confirmation', (0, auth_middlewares_1.rateLimiterUsingThirdParty)(), ...auth_middlewares_1.registrationConfirmationBody, middlewares_1.validatorsErrorsMiddleware, authControllers.registrationConfirmation.bind(authControllers));
router.post('/login', (0, auth_middlewares_1.rateLimiterUsingThirdParty)(), ...auth_middlewares_1.loginBody, middlewares_1.validatorsErrorsMiddleware, authControllers.login.bind(authControllers));
router.post('/logout', auth_middlewares_1.authJwtMiddleware, authControllers.logout.bind(authControllers));
router.post('/password-recovery', (0, auth_middlewares_1.rateLimiterUsingThirdParty)(), ...auth_middlewares_1.passwordRecoveryBody, middlewares_1.validatorsErrorsMiddleware, authControllers.passwordRecovery.bind(authControllers));
router.post('/new-password', (0, auth_middlewares_1.rateLimiterUsingThirdParty)(), ...auth_middlewares_1.newPasswordBody, middlewares_1.validatorsErrorsMiddleware, authControllers.setNewPassword.bind(authControllers));
router.post('/refresh-token', auth_middlewares_1.authJwtMiddleware, authControllers.refreshPassword.bind(authControllers));
router.get('/me', auth_middlewares_1.authJwtAccessMiddleware, authControllers.getMeInfo.bind(authControllers));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map