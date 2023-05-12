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
        const { pageSize, pageNumber, sortBy, sortDirection } = req.query;
        const result = await this.securityDeviceService.securityDeviceQueryRepo.find(
            { pageSize, pageNumber, sortBy, sortDirection },
            { userId: req?.context?.user?.id }
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }
    async deleteUserDeviceById(
        req: Request<{ deviceId: string }, {}, {}, {}>,
        res: Response
    ) {
        const dId = req.params.deviceId;
        const findDevice = await this.securityDeviceService.securityDeviceQueryRepo.findByDeviceId(dId);
        if (!findDevice) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        if (findDevice.userId !== req?.context?.user?.id) return res.status(HTTP_STATUSES.FORBIDDEN_403).send();

        await this.securityDeviceService.deleteByDeviceId(dId);
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }

    async deleteAllUserDecices(
        req: Request<{}, {}, {}, {}>,
        res: Response
    ) {
        await this.securityDeviceService.deleteAllUserDevice(req?.context?.user?.id);
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
}