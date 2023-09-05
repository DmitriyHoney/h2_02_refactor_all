import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { PostsService } from '../services/posts.services';
import { BaseGetQueryParams, HTTP_STATUSES } from "../config/baseTypes";
import {checkMongooseErrorsOnDuplicateKey} from "../helpers";
import {PostInputT} from '../models/posts.models';
import {PostsCommentsService} from "../services/postsComments.services";
import { log } from "node:console";

@injectable()
export class PostsControllers {
    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(PostsCommentsService) protected postsCommentsService: PostsCommentsService
    ) {}
    async getAll(
        req: Request<{}, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const { pageSize, pageNumber, sortBy, sortDirection} = req.query;
        const result = await this.postsService.postsQueryRepo.find(
            req?.context?.user?.id,
            { pageSize, pageNumber, sortBy, sortDirection },
            {}
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async getOne(
        req: Request<{ id: string }, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const result = await this.postsService.postsQueryRepo.findById(req.params.id, req?.context?.user?.id);
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async create(
        req: Request<{}, {}, PostInputT, {}>,
        res: Response
    ) {
        try {
            const postId = await this.postsService.create(req.body);
            const post = await this.postsService.postsQueryRepo.findById(postId, req?.context?.user?.id);
            res.status(HTTP_STATUSES.CREATED_201).send(post);
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
    async createComment(
        req: Request<{ id: string }, {}, {}, {}>,
        res: Response
    ) {
        const result = await this.postsService.postsQueryRepo.findById(req.params.id, req?.context?.user?.id);
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        // @ts-ignore
        const commentId = await this.postsCommentsService.create(req.context.user, result.id, req.body);
        const comment = await this.postsCommentsService.postsCommentsQueryRepo.findById(commentId, req?.context?.user?.id);
        res.status(HTTP_STATUSES.CREATED_201).send(comment);
    }
    async getComments(
        req: Request<{ id: string }, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const result = await this.postsService.postsQueryRepo.findById(req.params.id, req?.context?.user?.id);
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();

        const { pageSize, pageNumber, sortBy, sortDirection } = req.query;

        const comment = await this.postsCommentsService.postsCommentsQueryRepo.find(
            req?.context?.user?.id,
            { pageSize, pageNumber, sortBy, sortDirection },
            { postId: req.params.id }
        );
        res.status(HTTP_STATUSES.OK_200).send(comment);
    }
    async likeUnlikePost(
        req: Request<{ id: string }, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const post = await this.postsService.postsQueryRepo.findById(req.params.id, req?.context?.user?.id);
        if (!post) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        // @ts-ignore
        await this.postsService.likeUnlikePost(req.params.id, req.body.likeStatus, post, req.context.user);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
}