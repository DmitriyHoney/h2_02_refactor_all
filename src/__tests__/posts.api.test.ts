import request from 'supertest';

import {HTTP_STATUSES, VALIDATION_ERROR_MSG, ValidationErrors} from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";
import {UserPostT} from "../models/users.models";

// @ts-ignore
const userPayload: UserPostT = {
    login: 'test1',
    email: 'test@mail.ru',
    password: '12345678',
};
const userAccessRefreshTokens = {
    access: '',
    refresh: '',
};

let createdBlog = {};
const createBlogPayload = {
    name: "string",
    description: "string",
    websiteUrl: "https://ya.ru"
};

let createdPost = {};
const createPostPayload = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: ""
};

describe('/posts', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    afterAll(() => configForTests.server?.close());

    describe('Prepare for tests create and login user & create blog', () => {
       test('create and login', async () => {
           await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
               .send(userPayload)
               .expect(HTTP_STATUSES.CREATED_201);

           const result = await request(app)
               .post(configForTests.urls.auth.login)
               .send({
                   loginOrEmail: userPayload.login,
                   password: userPayload.password
               })
               .expect(HTTP_STATUSES.OK_200);

           userAccessRefreshTokens.access = result.body.accessToken;

           const cookies = result.headers['set-cookie'];
           userAccessRefreshTokens.refresh = cookies.find((i: string) => i.indexOf('refreshToken') >= 0);
           expect(userAccessRefreshTokens.refresh).toBeTruthy();
       });
        test('Create blog should return 201', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.blogs.all, `Bearer ${userAccessRefreshTokens.access}`)
                .send(createBlogPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            createdBlog = result.body;
            expect(result.body).toEqual({
                id: expect.any(String),
                name: createBlogPayload.name,
                description: createBlogPayload.description,
                websiteUrl: createBlogPayload.websiteUrl,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                isMembership: true
            });
        });
    });

    describe('/ - get all', () => {
        test('Get all should return 200', async () => {
            const result = await request(app)
                .get(configForTests.urls.posts.all)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(0);
        });
    });

    describe('/:postId - create post', () => {
        test('Create post should return 401 not provide accessToken', async () => {
            await request(app)
                .post(configForTests.urls.posts.all)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('Create post should return 400 bad request', async () => {
            await configForTests.reqWithAuthHeader('post', configForTests.urls.posts.all, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('Create post should return 201', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.posts.all, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    ...createPostPayload,
                    // @ts-ignore
                    blogId: createdBlog.id,
                })
                .expect(HTTP_STATUSES.CREATED_201);

            createdPost = result.body;
        });
    });

    describe('/:postId - get post', () => {
        test('Get by postId - should return 404 not exist', async () => {
            await request(app)
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/42`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Get by postId - should return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .expect(HTTP_STATUSES.OK_200);
        });
    });

    describe('/:postId - update post', () => {
        test('Update post should return 401 not provide accessToken', async () => {
            await request(app)
                // @ts-ignore
                .put(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('Update post should return 400 bad request', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('Update post should return 404 blog not exist', async () => {
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/42`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    ...createdPost,
                    shortDescription: 'updated descr',
                })
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Update post should return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    ...createdPost,
                    shortDescription: 'updated descr',
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.shortDescription).toBe('updated descr');
        });
    });

    describe('/:postId - delete post', () => {
        test('Delete post should return 401 not provide accessToken', async () => {
            await request(app)
                // @ts-ignore
                .delete(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('Delete post should return 404 post not exist', async () => {
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.posts.all}/42`, `Bearer ${userAccessRefreshTokens.access}`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Delete post should return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.posts.all}/${createdPost.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
    });
});