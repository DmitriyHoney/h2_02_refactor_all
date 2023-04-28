export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    NOT_AUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    NOT_FOUND_404 = 404,
    TOO_MANY_REQUESTS_429 = 429,
    SERVER_ERROR_500 = 500,
};

export const VALIDATION_ERROR_MSG = {
    REQUIRED: 'Field is required',
    IS_STRING: 'Field must be a string',
    IS_NUMBER: 'Field must be a number',
    IS_BOOLEAN: 'Field must be a boolean',
    IS_UNIQUE: 'Field must be an unique',
    IS_URL: 'Field must be an url',
    OUT_OF_RANGE: 'Field is out of range',
    BLOG_ID_NOT_FOUND: 'Blog with blogId not found',
    LOGIN_NOT_VALID_TEMPLATE: 'Not valid pattern login',
    EMAIL_NOT_VALID_TEMPLATE: 'Not valid pattern email',
    EMAIL_OR_PASSWORD_NOT_VALID: 'Email or password not valid',
    USER_THIS_EMAIL_EXIST: 'User this email already exist',
    USER_THIS_LOGIN_EXIST: 'User this login already exist',
};

export type BaseQueryT = {
    pageSize?: string,
    pageNumber?: string,
    sortBy?: string,
    sortDirection?: string,
}
export type BaseGetQueryParams = {
    pageSize?: string,
    pageNumber?: string,
    sortBy?: string,
    sortDirection?: string
}

export type ValidationError = { message: string, field: String }

export type ValidationErrors = {
    errorsMessages: Array<ValidationError>
}

export type ErrorsForControllers = {
    errorCode: HTTP_STATUSES,
    errorMessage: ValidationErrors | string
}