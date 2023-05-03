import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { PostsService } from '../services/posts.services';
import { BaseGetQueryParams, HTTP_STATUSES } from "../config/baseTypes";
import {checkMongooseErrorsOnDuplicateKey} from "../helpers";
import {PostInputT} from '../models/posts.models';

@injectable()
export class PostsControllers {
    constructor(@inject(PostsService) protected postsService: PostsService) {}
    async getAll(
        req: Request<{}, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const { pageSize, pageNumber, sortBy, sortDirection} = req.query;
        const result = await this.postsService.postsQueryRepo.find(
            { pageSize, pageNumber, sortBy, sortDirection },
            {}
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async getOne(
        req: Request<{ id: string }, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const result = await this.postsService.postsQueryRepo.findById(req.params.id);
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async create(
        req: Request<{}, {}, PostInputT, {}>,
        res: Response
    ) {
        try {
            const blogId = await this.postsService.create(req.body);
            const blog = await this.postsService.postsQueryRepo.findById(blogId);
            res.status(HTTP_STATUSES.CREATED_201).send(blog);
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
    async update(
        req: Request<{ id: string }, {}, PostInputT, {}>,
        res: Response
    ) {
        try {
            const isUpdated = await this.postsService.update(req.params.id, req.body);
            if (!isUpdated) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
            return res.status(HTTP_STATUSES.NO_CONTENT_204).send({});
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
    async deleteOne(
        req: Request<{ id: string }, {}, {}, {}>,
        res: Response
    ) {
        const isWasDeleted = await this.postsService.deleteOne(req.params.id);
        if (!isWasDeleted) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
}