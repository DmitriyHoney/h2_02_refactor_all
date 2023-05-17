import { Router } from 'express';
import container from '../composition/blogs.composition';
import { BlogsControllers } from "../controllers/blogs.controllers";
import {authJwtAccessMiddleware, authJwtMiddleware, basicAuthMiddleware} from "../middlewares/auth.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";
import {createAndUpdateBlogsBody} from "../middlewares/blogs.middlewares";
import { createPostFromBlogUrlBody } from "../middlewares/posts.middlewares";

const blogControllers = container.resolve(BlogsControllers);

const router = Router();

router.get('/', blogControllers.getAll.bind(blogControllers));
router.post(
    '/',
    basicAuthMiddleware,
    ...createAndUpdateBlogsBody, validatorsErrorsMiddleware,
    blogControllers.create.bind(blogControllers)
);
router.get('/:id', blogControllers.getOne.bind(blogControllers));
router.put(
    '/:id',
    basicAuthMiddleware,
    ...createAndUpdateBlogsBody, validatorsErrorsMiddleware,
    blogControllers.update.bind(blogControllers)
);
router.delete(
    '/:id',
    basicAuthMiddleware,
    blogControllers.deleteOne.bind(blogControllers)
);
router.get(
    '/:id/posts',
    authJwtMiddleware,
    blogControllers.getPostsForBlog.bind(blogControllers)
);
router.post(
    '/:id/posts',
    basicAuthMiddleware,
    ...createPostFromBlogUrlBody, validatorsErrorsMiddleware,
    blogControllers.createPostForBlog.bind(blogControllers)
);
export default router;