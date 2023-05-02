import { Router } from 'express';
import container from '../composition/securityDevice.composition';
import {SecurityDeviceControllers} from "../controllers/securityDevice.controllers";
import {authJwtMiddleware} from "../middlewares/auth.middlewares";


const securityDeviceControllers = container.resolve(SecurityDeviceControllers);

const router = Router();

router.get(
    '/',
    authJwtMiddleware,
    securityDeviceControllers.getAllUserDevices.bind(securityDeviceControllers)
);
router.delete(
    '/',
    authJwtMiddleware,
    securityDeviceControllers.deleteAllUserDecices.bind(securityDeviceControllers)
);
router.delete(
    '/:deviceId',
    authJwtMiddleware,
    securityDeviceControllers.deleteUserDeviceById.bind(securityDeviceControllers)
);

export default router;