import { HttpError } from "./HttpError";

export class EquipmentAreaNotFoundError extends HttpError {
    static readonly httpStatusCode = 404;

    constructor(message: string = "Equipment area relationship not found") {
        super(message, EquipmentAreaNotFoundError.httpStatusCode);
        this.name = 'EquipmentAreaNotFoundError';
        Object.setPrototypeOf(this, EquipmentAreaNotFoundError.prototype);
    }
}
