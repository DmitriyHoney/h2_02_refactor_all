import request from 'supertest';

import {HTTP_STATUSES, Likes, VALIDATION_ERROR_MSG, ValidationErrors} from '../config/baseTypes';
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


let createdUser2: any = {};
// @ts-ignore
const user2Payload: UserPostT = {
    login: 'test2',
    email: 'test2@mail.ru',
    password: '12345678',
};
const user2AccessRefreshTokens = {
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

           const cUser2 = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
               .send(user2Payload)
               .expect(HTTP_STATUSES.CREATED_201);

           createdUser2 = cUser2.body;

           const result2 = await request(app)
               .post(configForTests.urls.auth.login)
               .send({
                   loginOrEmail: user2Payload.login,
                   password: user2Payload.password
               })
               .expect(HTTP_STATUSES.OK_200);

           user2AccessRefreshTokens.access = result2.body.accessToken;

           const cookies2 = result2.headers['set-cookie'];
           user2AccessRefreshTokens.refresh = cookies2.find((i: string) => i.indexOf('refreshToken') >= 0);
           expect(user2AccessRefreshTokens.refresh).toBeTruthy();
       });
        test('Create blog should return 201', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.blogs.all, configForTests.basicToken)
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
                .set('Cookie', userAccessRefreshTokens.refresh)
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
            await configForTests.reqWithAuthHeader('post', configForTests.urls.posts.all, configForTests.basicToken)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('Create post should return 201', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.posts.all, configForTests.basicToken)
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
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Get by postId - should return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .set('Cookie', userAccessRefreshTokens.refresh)
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
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}`, configForTests.basicToken)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('Update post should return 404 blog not exist', async () => {
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/42`, configForTests.basicToken)
                .send({
                    ...createdPost,
                    shortDescription: 'updated descr',
                })
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Update post should return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}`, configForTests.basicToken)
                .send({
                    ...createdPost,
                    shortDescription: 'updated descr',
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .set('Cookie', userAccessRefreshTokens.refresh)
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
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.posts.all}/42`, configForTests.basicToken)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('Delete post should return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.posts.all}/${createdPost.id}`, configForTests.basicToken)
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
    });

    describe('like & unlike posts', () => {
        test('Create post should return 201', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.posts.all, configForTests.basicToken)
                .send({
                    ...createPostPayload,
                    // @ts-ignore
                    blogId: createdBlog.id,
                })
                .expect(HTTP_STATUSES.CREATED_201);

            createdPost = result.body;
        });
        test('like put - should return 401 not authorized', async () => {
            await request(app)
                // @ts-ignore
                .put(`${configForTests.urls.posts.all}/${createdPost.id}/like-status`)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('like put - should return 400 bad request', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('like put - should return 404 post does not exist', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/42/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    likeStatus: Likes.LIKE
                })
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('like put - should return 204 post like success', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    likeStatus: Likes.LIKE
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });

        test('Get by postId - should return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual({
                "id": expect.any(String),
                "title": expect.any(String),
                "shortDescription": expect.any(String),
                "content": expect.any(String),
                "blogId": expect.any(String),
                "blogName": expect.any(String),
                "createdAt": expect.any(String),
                "extendedLikesInfo": {
                    "likesCount": 1,
                    "dislikesCount": 0,
                    "myStatus": Likes.LIKE,
                    "newestLikes": [], // myStatus must not show
                }
            });
        });
        test('Get by postId another user - should return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .set('Cookie', user2AccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.extendedLikesInfo.likesCount).toBe(1);
            expect(result.body.extendedLikesInfo.dislikesCount).toBe(0);
            expect(result.body.extendedLikesInfo.myStatus).toBe(Likes.NONE);
            expect(result.body.extendedLikesInfo.newestLikes.length).toBe(1);
        });

        test('unlike put - should return 204 post like success', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.posts.all}/${createdPost.id}/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    likeStatus: Likes.DISLIKE
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });

        test('Get by postId another user - should return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}`)
                .set('Cookie', user2AccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.extendedLikesInfo.likesCount).toBe(0);
            expect(result.body.extendedLikesInfo.dislikesCount).toBe(1);
            expect(result.body.extendedLikesInfo.myStatus).toBe(Likes.NONE);
            expect(result.body.extendedLikesInfo.newestLikes.length).toBe(0);
        });
    });
});