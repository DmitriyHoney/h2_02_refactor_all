import {inject, injectable} from "inversify";
import {BlogsQueryRepo, BlogsCommandRepo} from "../repositry/blogs.repositry";
import {BlogInputT} from "../models/blogs.models";

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsQueryRepo) public blogsQueryRepo: BlogsQueryRepo,
        @inject(BlogsCommandRepo) protected blogsCommandRepo: BlogsCommandRepo
    ) {}
    async create(body: any): Promise<string> {
        return await this.blogsCommandRepo.create(body);
    }
    async update(id: string, body: BlogInputT) {
        return await this.blogsCommandRepo.update(id, body);
    }
    async deleteOne(id: string) {
        return await this.blogsCommandRepo.deleteOne(id);
    }
    async deleteAll() {
        return await this.blogsCommandRepo.deleteAll();
    }
}