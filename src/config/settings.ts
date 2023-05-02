export const settings = {
    JWT_SECRET: process?.env?.SECRET_KEY || 'secret',
    DB_NAME: process.env.DB_NAME || 'prod_db',
    DB_NAME_TEST: process.env.DB_NAME_TEST || 'test_db',
    PORT: process.env.PORT || 3000,
    PORT_TEST: process.env.PORT_TEST || 3001,
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017',
    BASIC_USERS: {
        admin: 'qwerty',
    },
    EXP_CONFIRM_CODE: process.env.EXP_CONFIRM_CODE || '10m',

    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PWD: process.env.SMTP_PWD,
    ACCESS_TOKEN_ALIVE: process.env.ACCESS_TOKEN_ALIVE || '10m',
    REFRESH_TOKEN_ALIVE: process.env.REFRESH_TOKEN_ALIVE || '30m',
};