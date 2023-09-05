"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Likes = exports.VALIDATION_ERROR_MSG = exports.HTTP_STATUSES = void 0;
var HTTP_STATUSES;
(function (HTTP_STATUSES) {
    HTTP_STATUSES[HTTP_STATUSES["OK_200"] = 200] = "OK_200";
    HTTP_STATUSES[HTTP_STATUSES["CREATED_201"] = 201] = "CREATED_201";
    HTTP_STATUSES[HTTP_STATUSES["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP_STATUSES[HTTP_STATUSES["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP_STATUSES[HTTP_STATUSES["NOT_AUTHORIZED_401"] = 401] = "NOT_AUTHORIZED_401";
    HTTP_STATUSES[HTTP_STATUSES["FORBIDDEN_403"] = 403] = "FORBIDDEN_403";
    HTTP_STATUSES[HTTP_STATUSES["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
    HTTP_STATUSES[HTTP_STATUSES["TOO_MANY_REQUESTS_429"] = 429] = "TOO_MANY_REQUESTS_429";
    HTTP_STATUSES[HTTP_STATUSES["SERVER_ERROR_500"] = 500] = "SERVER_ERROR_500";
})(HTTP_STATUSES = exports.HTTP_STATUSES || (exports.HTTP_STATUSES = {}));
;
exports.VALIDATION_ERROR_MSG = {
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
var Likes;
(function (Likes) {
    Likes["LIKE"] = "Like";
    Likes["DISLIKE"] = "Dislike";
    Likes["NONE"] = "None";
})(Likes = exports.Likes || (exports.Likes = {}));
