import { Container } from 'inversify';
import {PostsControllers} from "../controllers/posts.controllers";
import {PostsService} from "../services/posts.services";
import {PostsCommandRepo, PostsQueryRepo} from "../repositry/posts.repositry";

const container = new Container();
container.bind(PostsControllers).to(PostsControllers);
container.bind(PostsService).to(PostsService);
container.bind(PostsQueryRepo).to(PostsQueryRepo);
container.bind(PostsCommandRepo).to(PostsCommandRepo);
export default container;