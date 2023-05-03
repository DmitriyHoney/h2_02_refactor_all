import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { BlogsService } from '../services/blogs.services';
import { BaseGetQueryParams, HTTP_STATUSES } from "../config/baseTypes";
import { UserPostT } from "../models/users.models";
import {checkMongooseErrorsOnDuplicateKey} from "../helpers";
import {BlogInputT} from "../models/blogs.models";

@injectable()
export class BlogsControllers {
    constructor(@inject(BlogsService) protected blogsService: BlogsService) {}
    async getAll(
        req: Request<{}, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const { pageSize, pageNumber, sortBy, sortDirection} = req.query;
        const result = await this.blogsService.blogsQueryRepo.find(
            { pageSize, pageNumber, sortBy, sortDirection },
            {}
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async getOne(
        req: Request<{ id: string }, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const result = await this.blogsService.blogsQueryRepo.findById(req.params.id);
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async create(
        req: Request<{}, {}, BlogInputT, {}>,
        res: Response
    ) {
        try {
            const blogId = await this.blogsService.create(req.body);
            const blog = await this.blogsService.blogsQueryRepo.findById(blogId);
            res.status(HTTP_STATUSES.CREATED_201).send(blog);
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
    async update(
        req: Request<{ id: string }, {}, BlogInputT, {}>,
        res: Response
    ) {
        try {
            const isUpdated = await this.blogsService.update(req.params.id, req.body);
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
        const isWasDeleted = await this.blogsService.deleteOne(req.params.id);
        if (!isWasDeleted) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
}