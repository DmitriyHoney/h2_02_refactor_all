import { Container } from 'inversify';
import {PostsControllers} from "../controllers/posts.controllers";
import {PostsService} from "../services/posts.services";
import {PostsCommandRepo, PostsQueryRepo} from "../repositry/posts.repositry";
import {PostsCommentsService} from "../services/postsComments.services";
import {PostsCommentsCommandRepo, PostsCommentsQueryRepo} from "../repositry/postsComments.repositry";
import {BlogsQueryRepo} from "../repositry/blogs.repositry";

const container = new Container();
container.bind(PostsControllers).to(PostsControllers);
container.bind(PostsService).to(PostsService);
container.bind(PostsCommentsService).to(PostsCommentsService);
container.bind(PostsCommentsQueryRepo).to(PostsCommentsQueryRepo);
container.bind(PostsCommentsCommandRepo).to(PostsCommentsCommandRepo);
container.bind(PostsQueryRepo).to(PostsQueryRepo);
container.bind(BlogsQueryRepo).to(BlogsQueryRepo);
container.bind(PostsCommandRepo).to(PostsCommandRepo);
export default container;