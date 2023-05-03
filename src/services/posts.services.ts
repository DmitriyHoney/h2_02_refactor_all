import {inject, injectable} from "inversify";
import {PostsQueryRepo, PostsCommandRepo} from '../repositry/posts.repositry';
import {PostInputT} from '../models/posts.models';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsQueryRepo) public postsQueryRepo: PostsQueryRepo,
        @inject(PostsCommandRepo) protected postsCommandRepo: PostsCommandRepo
    ) {}
    async create(body: PostInputT): Promise<string> {
        return await this.postsCommandRepo.create(body);
    }
    async update(id: string, body: PostInputT) {
        return await this.postsCommandRepo.update(id, body);
    }
    async deleteOne(id: string) {
        return await this.postsCommandRepo.deleteOne(id);
    }
    async deleteAll() {
        return await this.postsCommandRepo.deleteAll();
    }
}