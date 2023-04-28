import request from 'supertest';

import {HTTP_STATUSES, VALIDATION_ERROR_MSG, ValidationErrors} from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";
import {UserPostT} from "../models/users.models";
import {jwtService} from "../managers/jwt.manager";

// @ts-ignore
const userPayload: UserPostT = {
    login: 'test1',
    email: '',
    password: '12345678',
};
const userEmail = {
    emailAddress: '',
    id: ''
};

const generatedAllCodes: Array<string> = [];

const generateUserEmailAndUpdatePayload = async () => {
    const { emailAddress, id } = await configForTests.getTestEmailAddress();
    userEmail.emailAddress = emailAddress;
    userEmail.id = id;
    userPayload.email = userEmail.emailAddress;
    return userEmail?.id ? true : false;
}

describe('/auth', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204, {});
    });

    afterAll(() => configForTests.server?.close());

    describe('/registration', () => {
        test('should return 204 - and confirmation code will be send to passed email address', async () => {
            const isGenerated = await generateUserEmailAndUpdatePayload();
            expect(isGenerated).toBeTruthy();
            expect(1).toBe(1);

            await request(app)
                .post(configForTests.urls.auth.registration)
                .send(userPayload)
                .expect(HTTP_STATUSES.NO_CONTENT_204, {});
        });
        test('user should get on this email confirmed code and it valid', async () => {
            const code = await configForTests.getVerificationCode(userEmail.id);
            generatedAllCodes.push(code);
            const isValidCode = jwtService.verifyToken(code);
            expect(code).toBeTruthy();
            expect(code.length).toBeGreaterThan(1);
            expect(isValidCode).toBeTruthy();
        });
        test('should return 400 - user this login already exist', async () => {
            const result = await request(app)
                .post(configForTests.urls.auth.registration)
                .send(userPayload)
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
        test('should return 400 - user this email already exist', async () => {
            const result = await request(app)
                .post(configForTests.urls.auth.registration)
                .send({
                    ...userPayload,
                    login: 'wow'
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
        test('should return 429 - More than 5 attempts from one IP-address during 10 seconds', async () => {
            const promises = [];
            for (let i = 1; i <= 5; i++) {
                promises.push(request(app)
                    .post(configForTests.urls.auth.registration)
                    .send(userPayload))
            }
            await Promise.all(promises);

            await request(app)
                .post(configForTests.urls.auth.registration)
                .send(userPayload)
                .expect(HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        });
    });

    describe('/registration-email-resending', () => {
        test('should return 400 - incorrect email', async () => {
            const response = await request(app)
                .post(configForTests.urls.auth.registrationEmailResending)
                .send({
                    email: ''
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'email'
                    }
                ]
            } as ValidationErrors);
        });
        test('should return 204 - Email with confirmation code will be send to passed email address', async () => {
            await request(app)
                .post(configForTests.urls.auth.registrationEmailResending)
                .send({
                    email: userPayload.email
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });
        test('user should get on this email confirmed code and it valid', async () => {
            const code = await configForTests.getVerificationCode(userEmail.id);
            generatedAllCodes.push(code);
            const isValidCode = jwtService.verifyToken(code);
            expect(code).toBeTruthy();
            expect(code.length).toBeGreaterThan(1);
            expect(isValidCode).toBeTruthy();
        });
        test('should return 429 - More than 5 attempts from one IP-address during 10 seconds', async () => {
            const promises = [];
            for (let i = 1; i <= 5; i++) {
                promises.push(request(app)
                    .post(configForTests.urls.auth.registrationEmailResending)
                    .send({}))
            }
            await Promise.all(promises);

            request(app)
                .post(configForTests.urls.auth.registrationEmailResending)
                .send({})
                .expect(HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        });
    });

    describe('/registration-confirmation', () => {
        test('should return 400 if body incorrect', async () => {
            const result = await request(app)
                .post(configForTests.urls.auth.registrationConfirmation)
                .send({})
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(result.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'code',
                    }
                ]
            } as ValidationErrors);
        });
        test('should return 400 if code not found', async () => {
            const result = await request(app)
                .post(configForTests.urls.auth.registrationConfirmation)
                .send({
                    code: generatedAllCodes[0]
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(result.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'code',
                    }
                ]
            } as ValidationErrors);
        });
        test('should return 204 email was verified', async () => {
            await request(app)
                .post(configForTests.urls.auth.registrationConfirmation)
                .send({
                    code: generatedAllCodes[generatedAllCodes.length - 1]
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
        });
        test('should return 400 if user already applied', async () => {
            const result = await request(app)
                .post(configForTests.urls.auth.registrationConfirmation)
                .send({
                    code: generatedAllCodes[generatedAllCodes.length - 1]
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(result.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'code',
                    }
                ]
            } as ValidationErrors);
        });
        test('should return 429 - More than 5 attempts from one IP-address during 10 seconds', async () => {
            const promises = [];
            for (let i = 1; i <= 5; i++) {
                promises.push(request(app)
                    .post(configForTests.urls.auth.registrationConfirmation)
                    .send({}))
            }
            await Promise.all(promises);

            request(app)
                .post(configForTests.urls.auth.registrationConfirmation)
                .send({})
                .expect(HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        });
    });
});