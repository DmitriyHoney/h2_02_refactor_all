import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { UsersService } from "../services/users.services";
import { BaseGetQueryParams, HTTP_STATUSES } from "../config/baseTypes";
import { UserPostT } from "../models/users.models";
import {checkMongooseErrorsOnDuplicateKey} from "../helpers";

@injectable()
export class UsersControllers {
    constructor(@inject(UsersService) protected usersService: UsersService) {}
    async getAll(
        req: Request<{}, {}, {}, BaseGetQueryParams & { searchLoginTerm?: string, searchEmailTerm?: string }>,
        res: Response
    ) {
        const { pageSize, pageNumber, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = req.query;
        const result = await this.usersService.usersQueryRepo.find(
            { pageSize, pageNumber, sortBy, sortDirection },
            { searchEmailTerm, searchLoginTerm }
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async create(
        req: Request<{}, {}, UserPostT, {}>,
        res: Response
    ) {
        try {
            const userId = await this.usersService.createConfirmedUser(req.body);
            const user = await this.usersService.usersQueryRepo.findById(userId);
            res.status(HTTP_STATUSES.CREATED_201).send(user);
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
    async deleteOne(
        req: Request<{ id: string }, {}, {}, {}>,
        res: Response
    ) {
        const isWasDeleted = await this.usersService.deleteOne(req.params.id);
        if (!isWasDeleted) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }

}