import { Router } from 'express';
import container from '../composition/blogs.composition';
import { BlogsControllers } from "../controllers/blogs.controllers";
import {authJwtAccessMiddleware, basicAuthMiddleware} from "../middlewares/auth.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";
import {createAndUpdateBlogsBody} from "../middlewares/blogs.middlewares";

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
export default router;