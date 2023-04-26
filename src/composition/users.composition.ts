import { Container } from 'inversify';
import { UsersControllers } from "../controllers/user.controllers";
import { UsersService } from "../services/users.services";
import { UsersCommandRepo, UsersQueryRepo } from "../repositry/users.repositry";

const usersContainer = new Container();
usersContainer.bind(UsersControllers).to(UsersControllers);
usersContainer.bind(UsersService).to(UsersService);
usersContainer.bind(UsersQueryRepo).to(UsersQueryRepo);
usersContainer.bind(UsersCommandRepo).to(UsersCommandRepo);
export default usersContainer;