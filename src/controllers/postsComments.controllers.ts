import {inject, injectable} from "inversify";
import { Request, Response } from 'express';
import { BaseGetQueryParams, HTTP_STATUSES } from "../config/baseTypes";
import {checkMongooseErrorsOnDuplicateKey} from "../helpers";
import {PostCommentBodyT} from '../models/postsComments.models';
import {PostsCommentsService} from "../services/postsComments.services";

@injectable()
export class PostsCommentsControllers {
    constructor(@inject(PostsCommentsService) protected postsCommentsService: PostsCommentsService) {}
    async getAll(
        req: Request<{}, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const { pageSize, pageNumber, sortBy, sortDirection} = req.query;
        const result = await this.postsCommentsService.postsCommentsQueryRepo.find(
            req.context.user.id,
            { pageSize, pageNumber, sortBy, sortDirection },
            {}
        );
        res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async getOne(
        req: Request<{ id: string }, {}, {}, BaseGetQueryParams>,
        res: Response
    ) {
        const result = await this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, req.context.user.id);
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.OK_200).send(result);
    }

    async create(
        req: Request<{ id: string }, {}, PostCommentBodyT, {}>,
        res: Response
    ) {
        try {
            const blogId = await this.postsCommentsService.create(req.context.user, req.params.id, req.body);
            const blog = await this.postsCommentsService.postsCommentsQueryRepo.findById(blogId, req.context.user.id);
            res.status(HTTP_STATUSES.CREATED_201).send(blog);
        } catch (e) {
            const error = (e as Error);
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(checkMongooseErrorsOnDuplicateKey(error));
        }
    }
    async update(
        req: Request<{ id: string }, {}, PostCommentBodyT, {}>,
        res: Response
    ) {
        try {
            const comment = await this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, req.context.user.id);
            if (!comment) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
            // @ts-ignore
            if (comment && comment.commentatorInfo.userId !== req.context.user.id) return res.status(HTTP_STATUSES.FORBIDDEN_403).send();
            const isUpdated = await this.postsCommentsService.update(req.params.id, req.body);
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
        const comment = await this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, req.context.user.id);
        if (!comment) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        // @ts-ignore
        if (comment.commentatorInfo.userId !== req.context.user.id) return res.status(HTTP_STATUSES.FORBIDDEN_403).send();
        const isWasDeleted = await this.postsCommentsService.deleteOne(req.params.id);
        if (!isWasDeleted) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
    async likeUnlikeComment(
        req: Request<{ id: string }, {}, { likeStatus: string }, {}>,
        res: Response
    ) {
        const comment = await this.postsCommentsService.postsCommentsQueryRepo.findById(req.params.id, req.context.user.id);
        if (!comment) return res.status(HTTP_STATUSES.NOT_FOUND_404).send();
        // @ts-ignore
        await this.postsCommentsService.likeUnlikeComment(req.params.id, req.body.likeStatus, comment, req.context.user.id);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }
}