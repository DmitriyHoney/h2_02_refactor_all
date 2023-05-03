import { Router } from 'express';
import container from '../composition/blogs.composition';
import { BlogsControllers } from "../controllers/blogs.controllers";
import {authJwtAccessMiddleware} from "../middlewares/auth.middlewares";
import {validatorsErrorsMiddleware} from "../middlewares";
import {createAndUpdateBlogsBody} from "../middlewares/blogs.middlewares";

const blogControllers = container.resolve(BlogsControllers);

const router = Router();

router.get('/', blogControllers.getAll.bind(blogControllers));
router.post(
    '/',
    authJwtAccessMiddleware,
    ...createAndUpdateBlogsBody, validatorsErrorsMiddleware,
    blogControllers.create.bind(blogControllers)
);
router.get('/:id', blogControllers.getOne.bind(blogControllers));
router.put(
    '/:id',
    authJwtAccessMiddleware,
    ...createAndUpdateBlogsBody, validatorsErrorsMiddleware,
    blogControllers.update.bind(blogControllers)
);
router.delete(
    '/:id',
    authJwtAccessMiddleware,
    blogControllers.deleteOne.bind(blogControllers)
);
export default router;