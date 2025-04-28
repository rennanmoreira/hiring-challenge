export class DuplicateEntryError extends Error {
  static httpStatusCode = 409;

  constructor(message: string = "Duplicate entry") {
    super(message);
    this.name = "DuplicateEntryError";
  }
}
