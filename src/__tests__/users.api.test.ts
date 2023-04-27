import request from 'supertest';

import {HTTP_STATUSES, VALIDATION_ERROR_MSG, ValidationErrors} from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";

const userPayload = {
    login: 'testUser1',
    password: '12345678',
    email: 'test@ya.ru',
};

const userPayload2 = {
    login: 'testUser2',
    password: '12345678',
    email: 'test2@ya.ru',
};

describe('/users (Authorization - Basic)', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204, {});
    });

    afterAll(() => configForTests.server?.close());

    describe('Get all', () => {
        test('should return 401 - user unauthorized', async () => {
            await request(app)
                .get(configForTests.urls.users)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401, {});
        });
        test('should return 200 and empty items - user authorized ', async () => {
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(0);
        });
    });

    describe('Get all with filters', () => {
        test('delete all and create two users ', async () => {
            await request(app)
                .delete(configForTests.urls.deleteAll)
                .expect(HTTP_STATUSES.NO_CONTENT_204, {});

            await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload2)
                .expect(HTTP_STATUSES.CREATED_201);

            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(2);
        });
        test('get users by email total coincidence', async () => {
            const query = `?searchEmailTerm=${userPayload.email}`
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(1);
            expect(result.body.items[0].email).toBe(userPayload.email);
        });
        test('get users by email not total coincidence', async () => {
            const query = `?searchEmailTerm=test`
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(2);
        });
        test('get users by email which not exist', async () => {
            const query = `?searchEmailTerm=notExistEmail`
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(0);
        });
        test('get users by login total coincidence', async () => {
            const query = `?searchLoginTerm=${userPayload.login}`
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(1);
            expect(result.body.items[0].email).toBe(userPayload.email);
        });
        test('get users by login not total coincidence', async () => {
            const query = `?searchLoginTerm=testUser`
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(2);
        });
        test('get users by login which not exist', async () => {
            const query = `?searchLoginTerm=notExistLogin`
            const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body.items.length).toBe(0);
        });
        test('delete all', async () => {
            await request(app)
                .delete(configForTests.urls.deleteAll)
                .expect(HTTP_STATUSES.NO_CONTENT_204, {});
        });
    });

    describe('Create', () => {
        test('should return 401 - user unauthorized', async () => {
            await request(app)
                .post(configForTests.urls.users)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401, {});
        });
        test('should return 400 - incorrect payload body', async () => {
            await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        { message: 'Field is required', field: 'login' },
                        { message: 'Field is required', field: 'password' },
                        { message: 'Field is required', field: 'email' }
                    ]
                });
        });
        test('should return 201 - user was created | users get all should return 200', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            expect(result.body).toEqual({
                id: expect.any(String),
                login: userPayload.login,
                email: userPayload.email,
                createdAt: expect.any(String),
            });

            const users = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(users.body.items.length).toBe(1);
        });
        test('should return 400 - if login user already exist', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send({
                    ...userPayload2,
                    login: userPayload.login,
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(result.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'login'
                    }
                ]
            } as ValidationErrors);
        });
        test('should return 400 - if email user already exist', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send({
                    ...userPayload2,
                    email: userPayload.email,
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(result.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'email'
                    }
                ]
            } as ValidationErrors);
        });
    });

    describe('Delete', () => {
        let user1: any = null;
        let user2: any = null;
        test('create two users for test delete', async () => {
            await request(app)
                .delete(configForTests.urls.deleteAll)
                .expect(HTTP_STATUSES.NO_CONTENT_204, {});

            user1 = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            user2 = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload2)
                .expect(HTTP_STATUSES.CREATED_201);

            const users = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(users.body.items.length).toBe(2);
        });
        test('should return 401 - user unauthorized', async () => {
            await request(app)
                .delete(`${configForTests.urls.users}/42`)
                .send({})
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401, {});
        });
        test('should return 404 - user does not exist', async () => {
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.users}/42`, configForTests.basicToken)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        });
        test('should return 204 - user was deleted', async () => {
            await configForTests.reqWithAuthHeader('delete', `${configForTests.urls.users}/${user1.body.id}`, configForTests.basicToken)
                .expect(HTTP_STATUSES.NO_CONTENT_204);

            const users = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(users.body.items.length).toBe(1);
        });
        test('should return 204 - delete all users', async () => {
            await request(app)
                .delete(configForTests.urls.deleteAll)
                .expect(HTTP_STATUSES.NO_CONTENT_204, {});

            const users = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);

            expect(users.body.items.length).toBe(0);
        });
    });
});