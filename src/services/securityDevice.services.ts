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
    async deleteByDeviceId(deviceId: string) {
        return await this.securityDeviceCommandRepo.deleteByDeviceId(deviceId);
    }
    async deleteAllUserDevice(userId: string) {
        return await this.securityDeviceCommandRepo.deleteAllUserDevice(userId);
    }
    async deleteUserDeviceSessionByIpAndTitle(userId: string, userIp: string, userAgent: string) {
        return await this.securityDeviceCommandRepo.deleteByFields({ userId, ip: userIp, title: userAgent });
    }
    async deleteAllDevice() {
        return await this.securityDeviceCommandRepo.deleteAllDevice();
    }
}