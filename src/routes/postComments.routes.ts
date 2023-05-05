import { Router } from 'express';
import container from '../composition/postsComments.composition';
import { PostsCommentsControllers } from "../controllers/postsComments.controllers";
import {authJwtAccessMiddleware, authJwtMiddleware} from "../middlewares/auth.middlewares";
import {createPostsCommentsBody, createLikeForCommentBody} from "../middlewares/postsComments.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";

const controllers = container.resolve(PostsCommentsControllers);

const router = Router();

router.get('/:id', authJwtMiddleware, controllers.getOne.bind(controllers));
router.put(
    '/:id',
    authJwtAccessMiddleware, ...createPostsCommentsBody,
    validatorsErrorsMiddleware, controllers.update.bind(controllers)
);
router.delete('/:id', authJwtAccessMiddleware, controllers.deleteOne.bind(controllers));
router.put(
    '/:id/like-status',
    authJwtAccessMiddleware, ...createLikeForCommentBody,
    validatorsErrorsMiddleware, controllers.likeUnlikeComment.bind(controllers)
);
export default router;