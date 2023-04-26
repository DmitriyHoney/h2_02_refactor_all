import { Router } from 'express';
import container from '../composition/users.composition';
import {UsersService} from "../services/users.services";
import {HTTP_STATUSES} from "../config/baseTypes";
const router = Router();

const userService = container.resolve(UsersService);

router.delete('/', (req, res) => {
    Promise.all([
        userService.deleteAll(),
    ]).then((result) => {
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }).catch((err) => {
        res.status(HTTP_STATUSES.SERVER_ERROR_500).send();
    })
});

export default router;
