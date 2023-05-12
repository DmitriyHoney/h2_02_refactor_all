import request from 'supertest';

import {HTTP_STATUSES, Likes} from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";
import {UserPostT} from "../models/users.models";

let createdUser: any = {};
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

let createdComment = {};
const createCommentPayload = {
    content: "string string string string string string string string"
}

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
            const cUser = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            createdUser = cUser.body;

            const result = await request(app)
                .post(configForTests.urls.auth.login)
                .send({
                    loginOrEmail: userPayload.login,
                    password: userPayload.password
                })
                .expect(HTTP_STATUSES.OK_200);

            userAccessRefreshTokens.access = result.body.accessToken;

            const cookies2 = result.headers['set-cookie'];
            userAccessRefreshTokens.refresh = cookies2.find((i: string) => i.indexOf('refreshToken') >= 0);
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

            const cookies = result2.headers['set-cookie'];
            user2AccessRefreshTokens.refresh = cookies.find((i: string) => i.indexOf('refreshToken') >= 0);
            expect(user2AccessRefreshTokens.refresh).toBeTruthy();
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
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(0);
        });
    });

    describe('/:postId - create post', () => {
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

    describe('/posts/{postId}.comments - get comments by postId', () => {
        test('Refresh token not send - 401 not authorized', async () => {
            // @ts-ignore
            const url = `${configForTests.urls.posts.all}/${createdPost.id}/comments`;
            await request(app)
                .get(url)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
        });
        test('Post does not exist - 404', async () => {
            await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/42/comments`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        });
        test('Empty items - 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.posts.all}/${createdPost.id}/comments`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200)
        });
    });

    describe('/posts/{postId}.comments - create comment for post', () => {
        test('Not access token - 401', async () => {
            await request(app)
                // @ts-ignore
                .post(`${configForTests.urls.posts.all}/${createdPost.id}/comments`)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
        });
        test('Bad request - 400', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('post', `${configForTests.urls.posts.all}/${createdPost.id}/comments`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        test('Post does not exit - 404', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('post', `${configForTests.urls.posts.all}/42/comments`, `Bearer ${userAccessRefreshTokens.access}`)
                .send(createCommentPayload)
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        });
        test('Success - 201', async () => {
            // @ts-ignore
            const result = await configForTests.reqWithAuthHeader('post', `${configForTests.urls.posts.all}/${createdPost.id}/comments`, `Bearer ${userAccessRefreshTokens.access}`)
                .send(createCommentPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            createdComment = result.body;

            expect(result.body).toEqual({
                id: expect.any(String),
                content: expect.any(String),
                commentatorInfo: {
                    userId: createdUser.id,
                    userLogin: expect.any(String),
                },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            });
        });
    });

    describe('get update delete by id', () => {
        test('get must return 401 not refresh token', async () => {
            await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.comments.all}/${createdComment.id}`)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('get must return 404 not found', async () => {
            await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.comments.all}/42`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('get must return 200', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.comments.all}/${createdComment.id}`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual({
                id: expect.any(String),
                content: expect.any(String),
                commentatorInfo: {
                    userId: createdUser.id,
                    userLogin: expect.any(String),
                },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: Likes.NONE
                }
            });
        });

        // update
        test('put must return 401 not access token', async () => {
            await request(app)
                // @ts-ignore
                .put(`${configForTests.urls.comments.all}/${createdComment.id}`)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('put must return 404 not found', async () => {
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/42`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({ content: "wowowowowowowowowowowowowowowowowowowowowowo" })
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('put must return 403 forbidden', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/${createdComment.id}`, `Bearer ${user2AccessRefreshTokens.access}`)
                .send({ content: "wowowowowowowowowowowowowowowowowowowowowowo" })
                .expect(HTTP_STATUSES.FORBIDDEN_403);
        });
        test('put must return 400 bad request', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/${createdComment.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('put must return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/${createdComment.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({ content: "wowowowowowowowowowowowowowowowowowowowowowo" })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });

        // delete
        test('delete must return 401 not access token', async () => {
            await request(app)
                // @ts-ignore
                .delete(`${configForTests.urls.comments.all}/${createdComment.id}`)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });
        test('delete must return 404 not found', async () => {
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.comments.all}/42`, `Bearer ${userAccessRefreshTokens.access}`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('delete must return 403 forbidden', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.comments.all}/${createdComment.id}`, `Bearer ${user2AccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.FORBIDDEN_403);
        });
        test('delete must return 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.comments.all}/${createdComment.id}`, `Bearer ${userAccessRefreshTokens.access}`)
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });
    });

    describe('/like-status', () => {
        test('create comment', async () => {
            // @ts-ignore
            const result = await configForTests.reqWithAuthHeader('post', `${configForTests.urls.posts.all}/${createdPost.id}/comments`, `Bearer ${userAccessRefreshTokens.access}`)
                .send(createCommentPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            createdComment = result.body;
        });
        test('unathorized 401', async () => {
            request(configForTests.app)
                // @ts-ignore
                .put(`${configForTests.urls.comments.all}/${createdComment.id}/like-status`)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
        });
        test('bad request 400', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/${createdComment.id}/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);
        });
        test('comment not found 404', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/42/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    likeStatus: Likes.LIKE
                })
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('user1 add like status to comment 204', async () => {
            // @ts-ignore
            await configForTests.reqWithAuthHeader('put', `${configForTests.urls.comments.all}/${createdComment.id}/like-status`, `Bearer ${userAccessRefreshTokens.access}`)
                .send({
                    likeStatus: Likes.LIKE
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });
        test('user1 get comment', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.comments.all}/${createdComment.id}`)
                .set('Cookie', userAccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual({
                id: expect.any(String),
                content: expect.any(String),
                commentatorInfo: {
                    userId: createdUser.id,
                    userLogin: expect.any(String),
                },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: Likes.LIKE
                }
            });
        });
        test('user2 get comment', async () => {
            const result = await request(app)
                // @ts-ignore
                .get(`${configForTests.urls.comments.all}/${createdComment.id}`)
                .set('Cookie', user2AccessRefreshTokens.refresh)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual({
                id: expect.any(String),
                content: expect.any(String),
                commentatorInfo: {
                    userId: createdUser.id,
                    userLogin: expect.any(String),
                },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: Likes.NONE
                }
            });
        })
    });
});