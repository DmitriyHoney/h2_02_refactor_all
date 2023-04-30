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
}