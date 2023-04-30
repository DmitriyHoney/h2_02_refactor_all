import {inject, injectable} from "inversify";
import {
    SecurityDeviceCommandRepo, SecurityDeviceQueryRepo
} from "../repositry/securityDevice.repositry";

@injectable()
export class SecurityDeviceService {
    constructor(
        @inject(SecurityDeviceQueryRepo) public securityDeviceQueryRepo: SecurityDeviceQueryRepo,
        @inject(SecurityDeviceCommandRepo) protected securityDeviceCommandRepo: SecurityDeviceCommandRepo,
    ) {}
    async addUserActiveDeviceSession(user: any, ipAddress: string, userAgent: string) {
        return await this.securityDeviceCommandRepo.create(user.id, ipAddress, userAgent);
    }
}