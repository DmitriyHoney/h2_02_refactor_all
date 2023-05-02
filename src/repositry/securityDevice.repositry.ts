import { injectable } from "inversify";
import {BaseQueryT} from "../config/baseTypes";
import {baseRepositry} from "./base.repositry";
import {Session} from "../models/sessions.models";
import { randomUUID } from "node:crypto";

@injectable()
export class SecurityDeviceQueryRepo {
    protected Session;
    constructor() {
        this.Session = Session;
    }
    find(
        params: BaseQueryT,
        filters: { }
    ) {
        return baseRepositry.find(this.Session, params, filters, {});
    }
    findByDeviceId(deviceId: string) {
        return baseRepositry.findByFields(this.Session, { deviceId });
    }
}

@injectable()
export class SecurityDeviceCommandRepo {
    protected Session;
    constructor() {
        this.Session = Session;
    }
    async create(userId: string, ip: string, title: string): Promise<string> {
        const createdRow = await this.Session.create({
            userId,
            ip,
            title,
            deviceId: randomUUID()
        });
        return String(createdRow._id);
    }
    async deleteByDeviceId(deviceId: string): Promise<Boolean> {
        const deleted = await this.Session.deleteOne({ deviceId });
        return deleted.deletedCount > 0;
    }
    async deleteByFields(fields: {}): Promise<Boolean> {
        const deleted = await this.Session.deleteOne(fields);
        return deleted.deletedCount > 0;
    }
    async deleteAllUserDevice(userId: string) {
        const deleted = await this.Session.deleteMany({ userId });
        return deleted.deletedCount > 0;
    }
    async deleteAllDevice() {
        const deleted = await this.Session.deleteMany();
        return deleted.deletedCount > 0;
    }
}