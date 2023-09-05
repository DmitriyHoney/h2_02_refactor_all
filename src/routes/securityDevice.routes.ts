import { Router } from 'express';
import container from '../composition/securityDevice.composition';
import {SecurityDeviceControllers} from "../controllers/securityDevice.controllers";
import {authJwtMiddleware} from "../middlewares/auth.middlewares";


const securityDeviceControllers = container.resolve(SecurityDeviceControllers);

const router = Router();

router.get(
    '/',
    securityDeviceControllers.getAllUserDevices.bind(securityDeviceControllers)
);
router.delete(
    '/',
    securityDeviceControllers.deleteAllUserDecices.bind(securityDeviceControllers)
);
router.delete(
    '/:deviceId',
    securityDeviceControllers.deleteUserDeviceById.bind(securityDeviceControllers)
);

export default router;