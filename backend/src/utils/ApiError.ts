/**
 * Classe de erro personalizada para a API
 * Permite criar erros padronizados com status HTTP, tipo e detalhes
 */
export class ApiError extends Error {
  status: number;
  type: string;
  details: any;

  /**
   * Cria uma nova instância de ApiError
   * @param message Mensagem de erro
   * @param status Código de status HTTP
   * @param type Tipo de erro
   * @param details Detalhes adicionais do erro (opcional)
   */
  constructor(message: string, status: number = 500, type: string = "ApiError", details: any = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.type = type;
    this.details = details;
    
    // Necessário para que instanceof funcione corretamente com classes que estendem Error
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Cria um erro de validação (400 Bad Request)
   * @param message Mensagem de erro
   * @param details Detalhes da validação
   */
  static validation(message: string = "Validation error", details: any = null): ApiError {
    return new ApiError(message, 400, "ValidationError", details);
  }

  /**
   * Cria um erro de não encontrado (404 Not Found)
   * @param message Mensagem de erro
   * @param details Detalhes adicionais
   */
  static notFound(message: string = "Resource not found", details: any = null): ApiError {
    return new ApiError(message, 404, "NotFoundError", details);
  }

  /**
   * Cria um erro de não autorizado (401 Unauthorized)
   * @param message Mensagem de erro
   * @param details Detalhes adicionais
   */
  static unauthorized(message: string = "Unauthorized", details: any = null): ApiError {
    return new ApiError(message, 401, "UnauthorizedError", details);
  }

  /**
   * Cria um erro de proibido (403 Forbidden)
   * @param message Mensagem de erro
   * @param details Detalhes adicionais
   */
  static forbidden(message: string = "Forbidden", details: any = null): ApiError {
    return new ApiError(message, 403, "ForbiddenError", details);
  }

  /**
   * Cria um erro de conflito (409 Conflict)
   * @param message Mensagem de erro
   * @param details Detalhes adicionais
   */
  static conflict(message: string = "Conflict", details: any = null): ApiError {
    return new ApiError(message, 409, "ConflictError", details);
  }

  /**
   * Cria um erro de servidor interno (500 Internal Server Error)
   * @param message Mensagem de erro
   * @param details Detalhes adicionais
   */
  static internal(message: string = "Internal server error", details: any = null): ApiError {
    return new ApiError(message, 500, "InternalServerError", details);
  }

  /**
   * Cria um erro de dependência (409 Conflict) - quando não é possível excluir um recurso porque outros recursos dependem dele
   * @param message Mensagem de erro
   * @param details Detalhes sobre as dependências que impedem a exclusão
   */
  static dependencyConflict(message: string = "Cannot delete resource with dependencies", details: any = null): ApiError {
    return new ApiError(message, 409, "DependencyConflictError", details);
  }
}
