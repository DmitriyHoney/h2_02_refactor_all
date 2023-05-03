import { Router } from 'express';
import container from '../composition/auth.composition';
import { AuthControllers } from "../controllers/auth.controllers";
import { userPostBody } from "../middlewares/users.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";
import {
    authJwtAccessMiddleware,
    authJwtMiddleware,
    loginBody, newPasswordBody,
    passwordRecoveryBody,
    rateLimiterUsingThirdParty,
    registrationConfirmationBody,
    registrationResendingEmailBody
} from "../middlewares/auth.middlewares";

const authControllers = container.resolve(AuthControllers);

const router = Router();

router.post(
    '/registration',
    rateLimiterUsingThirdParty(), ...userPostBody, validatorsErrorsMiddleware,
    authControllers.registration.bind(authControllers)
);
router.post(
    '/registration-email-resending',
    rateLimiterUsingThirdParty(), ...registrationResendingEmailBody, validatorsErrorsMiddleware,
    authControllers.registrationResendEmail.bind(authControllers)
);
router.post(
    '/registration-confirmation',
    rateLimiterUsingThirdParty(), ...registrationConfirmationBody, validatorsErrorsMiddleware,
    authControllers.registrationConfirmation.bind(authControllers)
);
router.post(
    '/login',
    rateLimiterUsingThirdParty(), ...loginBody, validatorsErrorsMiddleware,
    authControllers.login.bind(authControllers)
);
router.post(
    '/logout',
    authJwtMiddleware,
    authControllers.logout.bind(authControllers)
);
router.post(
    '/password-recovery',
    rateLimiterUsingThirdParty(), ...passwordRecoveryBody, validatorsErrorsMiddleware,
    authControllers.passwordRecovery.bind(authControllers)
);
router.post(
    '/new-password',
    rateLimiterUsingThirdParty(), ...newPasswordBody, validatorsErrorsMiddleware,
    authControllers.setNewPassword.bind(authControllers)
);
router.post(
    '/refresh-token',
    authJwtMiddleware,
    authControllers.refreshPassword.bind(authControllers)
);
router.get(
    '/me',
    authJwtAccessMiddleware,
    authControllers.getMeInfo.bind(authControllers)
);
export default router;