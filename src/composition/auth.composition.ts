import { Container } from 'inversify';
import { UsersService } from "../services/users.services";
import {AuthControllers} from "../controllers/auth.controllers";
import {AuthService} from "../services/auth.services";
import {AuthCommandRepo, AuthQueryRepo} from "../repositry/auth.repositry";
import {UsersCommandRepo, UsersQueryRepo} from "../repositry/users.repositry";
import usersContainer from "./users.composition";

const authContainer = new Container();
authContainer.bind(AuthControllers).to(AuthControllers);
authContainer.bind(AuthService).to(AuthService);
authContainer.bind(AuthQueryRepo).to(AuthQueryRepo);
authContainer.bind(AuthCommandRepo).to(AuthCommandRepo);
authContainer.bind(UsersService).to(UsersService);
authContainer.bind(UsersQueryRepo).to(UsersQueryRepo);
authContainer.bind(UsersCommandRepo).to(UsersCommandRepo);
export default authContainer;