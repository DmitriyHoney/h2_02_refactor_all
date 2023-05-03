import { Router } from 'express';
import container from '../composition/posts.composition';
import { PostsControllers } from "../controllers/posts.controllers";
import {authJwtAccessMiddleware} from "../middlewares/auth.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";
import {createPostsBody} from "../middlewares/posts.middlewares";

const postControllers = container.resolve(PostsControllers);

const router = Router();

router.get('/', postControllers.getAll.bind(postControllers));
router.post(
    '/',
    authJwtAccessMiddleware,
    ...createPostsBody, validatorsErrorsMiddleware,
    postControllers.create.bind(postControllers)
);
router.get('/:id', postControllers.getOne.bind(postControllers));
router.put(
    '/:id',
    authJwtAccessMiddleware,
    ...createPostsBody, validatorsErrorsMiddleware,
    postControllers.update.bind(postControllers)
);
router.delete(
    '/:id',
    authJwtAccessMiddleware,
    postControllers.deleteOne.bind(postControllers)
);
export default router;