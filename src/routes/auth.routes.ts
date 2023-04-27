import { Router } from 'express';
import container from '../composition/auth.composition';
import { AuthControllers } from "../controllers/auth.controllers";
import { userPostBody } from "../middlewares/users.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";

const authControllers = container.resolve(AuthControllers);

const router = Router();

router.post('/registration', ...userPostBody, validatorsErrorsMiddleware, authControllers.registration.bind(authControllers));

export default router;