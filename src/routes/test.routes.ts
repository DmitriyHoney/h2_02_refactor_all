import { Router } from 'express';
import usersContainer from '../composition/users.composition';
import securityDeviceContainer from '../composition/securityDevice.composition';
import blogsContainer from '../composition/blogs.composition';
import {UsersService} from "../services/users.services";
import {HTTP_STATUSES} from "../config/baseTypes";
import {SecurityDeviceService} from "../services/securityDevice.services";
import {BlogsService} from "../services/blogs.services";
const router = Router();

const userService = usersContainer.resolve(UsersService);
const deviceService = securityDeviceContainer.resolve(SecurityDeviceService);
const blogService = blogsContainer.resolve(BlogsService);

router.delete('/', (req, res) => {
    Promise.all([
        userService.deleteAll(),
        deviceService.deleteAllDevice(),
        blogService.deleteAll(),
        // TODO: add logic delete all devices
    ]).then((result) => {
        res.status(HTTP_STATUSES.NO_CONTENT_204).send();
    }).catch((err) => {
        res.status(HTTP_STATUSES.SERVER_ERROR_500).send();
    })
});

export default router;
