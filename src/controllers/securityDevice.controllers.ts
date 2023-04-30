import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import {SecurityDeviceService} from "../services/securityDevice.services";
import {BaseGetQueryParams, HTTP_STATUSES} from "../config/baseTypes";

@injectable()
export class SecurityDeviceControllers {
    constructor(
        @inject(SecurityDeviceService) protected securityDeviceService: SecurityDeviceService
    ) {}
    async getAllUserDevices(
        req: Request<{}, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        req.query
        const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
        const result = await this.securityDeviceService.securityDeviceQueryRepo.find(
            { pageSize, pageNumber, sortBy, sortDirection },
            {}
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }
}