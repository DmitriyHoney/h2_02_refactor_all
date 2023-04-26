import { Router } from 'express';
import container from '../composition/users.composition';
import {UsersControllers} from "../controllers/user.controllers";
import {basicAuthMiddleware} from "../middlewares/auth.middlewares";
import { userPostBody } from "../middlewares/users.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";

const userControllers = container.resolve(UsersControllers);

const router = Router();

router.get('/', basicAuthMiddleware, userControllers.getAll.bind(userControllers));
router.post('/', basicAuthMiddleware, ...userPostBody, validatorsErrorsMiddleware, userControllers.create.bind(userControllers));
router.delete('/:id', basicAuthMiddleware, userControllers.deleteOne.bind(userControllers));

export default router;