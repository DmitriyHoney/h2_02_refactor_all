import { Container } from 'inversify';
import {PostsCommentsControllers} from "../controllers/postsComments.controllers";
import {PostsCommentsService} from "../services/postsComments.services";
import {PostsCommentsCommandRepo, PostsCommentsQueryRepo} from "../repositry/postsComments.repositry";

const container = new Container();
container.bind(PostsCommentsControllers).to(PostsCommentsControllers);
container.bind(PostsCommentsService).to(PostsCommentsService);
container.bind(PostsCommentsQueryRepo).to(PostsCommentsQueryRepo);
container.bind(PostsCommentsCommandRepo).to(PostsCommentsCommandRepo);
export default container;