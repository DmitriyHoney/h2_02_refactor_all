import { Router } from 'express';
import container from '../composition/posts.composition';
import { PostsControllers } from "../controllers/posts.controllers";
import {authJwtAccessMiddleware, authJwtMiddleware, basicAuthMiddleware} from "../middlewares/auth.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";
import {createPostsBody, createPostsLikeBody} from "../middlewares/posts.middlewares";
import {createPostsCommentsBody} from "../middlewares/postsComments.middlewares";

const postControllers = container.resolve(PostsControllers);

const router = Router();

router.get(
    '/',
    authJwtMiddleware,
    postControllers.getAll.bind(postControllers)
);
router.post(
    '/',
    basicAuthMiddleware,
    ...createPostsBody, validatorsErrorsMiddleware,
    postControllers.create.bind(postControllers)
);
router.get(
    '/:id',
    authJwtMiddleware,
    postControllers.getOne.bind(postControllers)
);
router.put(
    '/:id',
    basicAuthMiddleware,
    ...createPostsBody, validatorsErrorsMiddleware,
    postControllers.update.bind(postControllers)
);
router.delete(
    '/:id',
    basicAuthMiddleware,
    postControllers.deleteOne.bind(postControllers)
);
router.get(
    '/:id/comments/',
    authJwtMiddleware,
    postControllers.getComments.bind(postControllers)
);
router.post(
    '/:id/comments/',
    authJwtAccessMiddleware,
    ...createPostsCommentsBody, validatorsErrorsMiddleware,
    postControllers.createComment.bind(postControllers)
);
router.put(
    '/:id/like-status/',
    authJwtAccessMiddleware,
    ...createPostsLikeBody, validatorsErrorsMiddleware,
    postControllers.likeUnlikePost.bind(postControllers)
);

export default router;