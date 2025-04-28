import { HttpError } from "./HttpError";

export class UserNotFoundError extends HttpError {
    static readonly httpStatusCode = 404;

    constructor(message: string = "User not found") {
        super(message, UserNotFoundError.httpStatusCode);
        this.name = 'UserNotFoundError';
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}
