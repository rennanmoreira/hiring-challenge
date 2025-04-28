import { HttpError } from "./HttpError";

export class AreaNeighborNotFoundError extends HttpError {
    static readonly httpStatusCode = 404;

    constructor(message: string = "Area neighbor relationship not found") {
        super(message, AreaNeighborNotFoundError.httpStatusCode);
        this.name = 'AreaNeighborNotFoundError';
        Object.setPrototypeOf(this, AreaNeighborNotFoundError.prototype);
    }
}
