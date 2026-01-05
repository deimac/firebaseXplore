export class AppError extends Error {
    code;
    statusCode;
    constructor(message, code = "INTERNAL_ERROR", statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, "VALIDATION_ERROR", 400);
        this.name = "ValidationError";
    }
}
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, "NOT_FOUND", 404);
        this.name = "NotFoundError";
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, "UNAUTHORIZED", 401);
        this.name = "UnauthorizedError";
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, "FORBIDDEN", 403);
        this.name = "ForbiddenError";
    }
}
