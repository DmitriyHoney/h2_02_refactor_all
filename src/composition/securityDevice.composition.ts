import { Container } from 'inversify';
import { SecurityDeviceControllers } from "../controllers/securityDevice.controllers";
import { SecurityDeviceService } from "../services/securityDevice.services";
import { SecurityDeviceCommandRepo, SecurityDeviceQueryRepo } from "../repositry/securityDevice.repositry";

const securityDeviceContainer = new Container();
securityDeviceContainer.bind(SecurityDeviceControllers).to(SecurityDeviceControllers);
securityDeviceContainer.bind(SecurityDeviceService).to(SecurityDeviceService);
securityDeviceContainer.bind(SecurityDeviceQueryRepo).to(SecurityDeviceQueryRepo);
securityDeviceContainer.bind(SecurityDeviceCommandRepo).to(SecurityDeviceCommandRepo);

export default securityDeviceContainer;