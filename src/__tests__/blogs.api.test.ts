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

describe('/blogs', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    afterAll(() => configForTests.server?.close());

    describe('Prepare for tests create and login user', () => {
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
    });

    describe('/ - get all', () => {
        test('Get all should return 200', async () => {
            const result = await request(app)
                .get(configForTests.urls.blogs.all)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(0);
        });
    });

    describe('/:blogId - create blog', () => {
        test('Create blog should return 401 not provide accessToken', async () => {
            await request(app)
                .post(configForTests.urls.blogs.all)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('Create blog should return 400 bad request', async () => {
            await configForTests.reqWithAuthHeader('post', configForTests.urls.blogs.all, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
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

    describe('/:blogId - get blog', () => {
        test('Get by blogId - should return 404 not exist', async () => {
            await request(app)
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.blogs.all}/42`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Get by blogId - should return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.blogs.all}/${createdBlog.id}`)
                .expect(HTTP_STATUSES.OK_200);

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

    describe('/:blogId - update blog', () => {
        test('Update blog should return 401 not provide accessToken', async () => {
            await request(app)
                // @ts-ignore
                .put(`${configForTests.urls.blogs.all}/${createdBlog.id}`)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('Update blog should return 400 bad request', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.blogs.all}/${createdBlog.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('Update blog should return 404 blog not exist', async () => {
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.blogs.all}/42`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    ...createBlogPayload,
                    description: 'updated descr',
                })
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Update blog should return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.blogs.all}/${createdBlog.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    ...createBlogPayload,
                    description: 'updated descr',
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.blogs.all}/${createdBlog.id}`)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual({
                id: expect.any(String),
                name: createBlogPayload.name,
                description: 'updated descr',
                websiteUrl: createBlogPayload.websiteUrl,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                isMembership: true
            });
        });
    });

    describe('/:blogId - delete blog', () => {
        test('Delete blog should return 401 not provide accessToken', async () => {
            await request(app)
                // @ts-ignore
                .delete(`${configForTests.urls.blogs.all}/${createdBlog.id}`)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('Delete blog should return 404 blog not exist', async () => {
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.blogs.all}/42`, `Bearer ${userAccessRefreshTokens.access}`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Delete blog should return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.blogs.all}/${createdBlog.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.blogs.all}/${createdBlog.id}`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
    });
});