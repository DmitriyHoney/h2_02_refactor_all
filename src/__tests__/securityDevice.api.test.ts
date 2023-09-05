import request from 'supertest';

import {HTTP_STATUSES, VALIDATION_ERROR_MSG, ValidationErrors} from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";
import {UserPostT} from "../models/users.models";
import {jwtService} from "../managers/jwt.manager";

// @ts-ignore
const userPayload: UserPostT = {
    login: 'test',
    email: 'test@mail.ru',
    password: '12345678',
};

const userPayload2: UserPostT = {
    login: 'test2',
    email: 'test2@mail.ru',
    password: '12345678',
};

let user1 = null;
let user2 = null;

const user1AuthInfo = {
    accessToken: '',
    refreshToken: '',
    devices: [],
};

const user2AuthInfo = {
    accessToken: '',
    refreshToken: '',
    devices: [],
};

describe('/security/devices', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204, {});
    });

    afterAll(() => configForTests.server?.close());

    describe('/security/devices', () => {
        describe('Create and login user', () => {
            test('should return 201 user was created', async () => {
                const result1 = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                    .send(userPayload)
                    .expect(HTTP_STATUSES.CREATED_201);

                user1 = result1.body;

                const result2 = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                    .send(userPayload2)
                    .expect(HTTP_STATUSES.CREATED_201);

                user1 = result2.body;
            });
            test('should return 200 user was signIn and get refresh and access tokens', async () => {
                const result1 = await request(app)
                    .post(configForTests.urls.auth.login)
                    .send({
                        loginOrEmail: userPayload.login,
                        password: userPayload.password
                    })
                    .expect(HTTP_STATUSES.OK_200);

                user1AuthInfo.accessToken = result1.body.accessToken;
                user1AuthInfo.refreshToken = result1.headers['set-cookie'];
            });
        });

        describe('GET', () => {
            test('status 200 and get one device service', async () => {
                const result = await request(app)
                    .get(configForTests.urls.securityDevice)
                    .set('Cookie', user1AuthInfo.refreshToken)
                    .expect(HTTP_STATUSES.OK_200)

                user1AuthInfo.devices = result.body.items;
                expect(result.body.items.length).toBe(1);
            });
            // test('status 401 if refreshToken is missing in cookie', async () => {
            //     await request(app)
            //         .get(configForTests.urls.securityDevice)
            //         .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
            // });
            // test('status 401 if refreshToken incorrect', async () => {
            //     const result = await request(app)
            //         .get(configForTests.urls.securityDevice)
            //         .set('Cookie', user1AuthInfo.accessToken)
            //         .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
            // });
        });

        describe('DELETE BY DEVICE ID', () => {
            // test('status 401 if refreshToken is missing in cookie', async () => {
            //     await request(app)
            //         .delete(`${configForTests.urls.securityDevice}/42`)
            //         .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
            // });
            // test('status 401 if refreshToken incorrect', async () => {
            //     await request(app)
            //         .delete(`${configForTests.urls.securityDevice}/42`)
            //         .set('Cookie', user1AuthInfo.accessToken)
            //         .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
            // });
            test('status 404 if device not found', async () => {
                const result = await request(app)
                    .delete(`${configForTests.urls.securityDevice}/42`)
                    .set('Cookie', user1AuthInfo.refreshToken)
                    .expect(HTTP_STATUSES.NOT_FOUND_404)
            });
            // test('status 403 if try delete device another user', async () => {
            //     await request(app)
            //         // @ts-ignore
            //         .delete(`${configForTests.urls.securityDevice}/${user2AuthInfo.devices[0].deviceId}`)
            //         .set('Cookie', user1AuthInfo.refreshToken)
            //         .expect(HTTP_STATUSES.FORBIDDEN_403)
            // });
            // test('status 204 device was delete success', async () => {
            //     await request(app)
            //         // @ts-ignore
            //         .delete(`${configForTests.urls.securityDevice}/${user1AuthInfo.devices[0].deviceId}`)
            //         .set('Cookie', user1AuthInfo.refreshToken)
            //         .expect(HTTP_STATUSES.NO_CONTENT_204)
            // });
        });

        describe('DELETE ALL', () => {
            // test('status 401 if refreshToken is missing in cookie', async () => {
            //     await request(app)
            //         .delete(configForTests.urls.securityDevice)
            //         .set('Cookie', user1AuthInfo.refreshToken + '123123123')
            //         .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
            // });
            test('status 204 devices was delete success', async () => {
                await request(app)
                    .delete(configForTests.urls.securityDevice)
                    .set('Cookie', user2AuthInfo.refreshToken)
                    .expect(HTTP_STATUSES.NO_CONTENT_204)
            });
        });
    });

    describe('Login user and logout must create device session and delete it', () => {
        test('Delete all data', async () => {
            await request(app)
                .delete(configForTests.urls.deleteAll)
                .expect(HTTP_STATUSES.NO_CONTENT_204, {});
        });
        test('create and login user', async () => {
            const result = await configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(userPayload)
                .expect(HTTP_STATUSES.CREATED_201);

            user1 = result.body;

            const result1 = await request(app)
                .post(configForTests.urls.auth.login)
                .send({
                    loginOrEmail: userPayload.login,
                    password: userPayload.password
                })
                .expect(HTTP_STATUSES.OK_200);

            user1AuthInfo.accessToken = result1.body.accessToken;
            user1AuthInfo.refreshToken = result1.headers['set-cookie'];
        });
        test('get session device must be 1', async () => {
            const result = await request(app)
                .get(configForTests.urls.securityDevice)
                .set('Cookie', user1AuthInfo.refreshToken)
                .expect(HTTP_STATUSES.OK_200)

            user1AuthInfo.devices = result.body.items;
            expect(result.body.items.length).toBe(1);
        });
        test('logout user, session device must be 0', async () => {
            const result = await request(app)
                .post(configForTests.urls.auth.logout)
                .set('Cookie', user1AuthInfo.refreshToken)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            const result2 = await request(app)
                .get(configForTests.urls.securityDevice)
                .set('Cookie', user1AuthInfo.refreshToken)
                .expect(HTTP_STATUSES.OK_200)

            expect(result2.body.items.length).toBe(0);
        });
    });
});