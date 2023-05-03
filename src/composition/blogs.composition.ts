import { Container } from 'inversify';
import {BlogsControllers} from "../controllers/blogs.controllers";
import {BlogsService} from "../services/blogs.services";
import {BlogsCommandRepo, BlogsQueryRepo} from "../repositry/blogs.repositry";

const container = new Container();
container.bind(BlogsControllers).to(BlogsControllers);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsQueryRepo).to(BlogsQueryRepo);
container.bind(BlogsCommandRepo).to(BlogsCommandRepo);
export default container;