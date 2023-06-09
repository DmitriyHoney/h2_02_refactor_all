import { settings } from '../config/settings';
import { connectDB } from '../config/dataBase';
import { Server } from 'http';
import request from 'supertest';
import app from '../app';
import MailSlurp, {CreateInboxRequest} from "mailslurp-client";
import {jwtService} from "../managers/jwt.manager";

export const configForTests = {
    urls: {
        users: '/api/users/',
        deleteAll: '/api/testing/all-data/',
        auth: {
            registration: '/api/auth/registration',
            registrationEmailResending: '/api/auth/registration-email-resending',
            registrationConfirmation: '/api/auth/registration-confirmation',
            login: '/api/auth/login',
            logout: '/api/auth/logout',
            passwordRecovery: '/api/auth/password-recovery',
            newPassword: '/api/auth/new-password',
            refreshToken: '/api/auth/refresh-token',
            me: '/api/auth/me',
        },
        blogs: {
            all: '/api/blogs',
        },
        posts: {
            all: '/api/posts',
        },
        comments: {
            all: '/api/comments',
        },
        securityDevice: '/api/security/devices'
    },
    smptApi: new MailSlurp({ apiKey: '76936eb68c09c69e56ad1a477d351723f80821c2b57c99447976e3c65ad28318' }),
    basicToken: 'Basic YWRtaW46cXdlcnR5',
    incorrectBasicToken: 'Basic YWRtaW46cXdlcnT6',
    server: null as Server | null,
    app: app as any,
    startTestServer() {
        this.server = app.listen(settings.PORT_TEST, async () => {
            await connectDB(settings.DB_NAME_TEST);
        });
    },
    reqWithAuthHeader(method: string, url: string, token: string) {
        // TODO: remove //@ts-ignore
        // @ts-ignore
        return request(app)[method](url).set('Authorization', token);
    },
    async getTestEmailAddress() {
        const inboxes = await this.smptApi.inboxController.getInboxes({});
        const lastEmailAddress = inboxes[inboxes.length - 1];
        return lastEmailAddress;
    },
    async getVerificationCode(inboxId: string) {
        await this.smptApi.inboxController.deleteAllInboxEmails({ inboxId });
        const emails = await this.smptApi.waitForLatestEmail(inboxId, 15000);
        try {
            // @ts-ignore
            return /code=(.*?')/.exec(emails.body)![1].replace(/'/, '');
        } catch {
            return '';
        }
    },
    async getVerificationRecoveryCode(inboxId: string) {
        await this.smptApi.inboxController.deleteAllInboxEmails({ inboxId });
        const emails = await this.smptApi.waitForLatestEmail(inboxId, 15000);
        try {
            // @ts-ignore
            return /recoveryCode=(.*?')/.exec(emails.body)![1].replace(/'/, '');
        } catch {
            return '';
        }
    },
    async getFailedUserAccessToken() {
        return await jwtService.createJWT({
            id: '6450de1f045521f880a34350',
            login: 'loginnn',
            email: 'user.email'
        }, '10m');
    }
}