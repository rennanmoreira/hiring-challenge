/**
 * Classe utilitária para padronizar o tratamento de erros da API no frontend
 */
export class ApiErrorHandler {
  /**
   * Extrai a mensagem de erro e os detalhes de uma resposta de erro da API
   * @param error Objeto de erro retornado pela API
   * @returns Objeto com mensagem e detalhes formatados
   */
  static getErrorDetails(error: any): { message: string; details: string; fullError: any } {
    // Mensagem padrão caso não consiga extrair do erro
    let message = 'Ocorreu um erro inesperado';
    let details = '';
    
    try {
      // Verifica se é um erro de API com formato padronizado
      if (error.response?.data) {
        // Extrai a mensagem principal
        message = error.response.data.message || message;
        
        // Extrai os detalhes, se existirem
        if (error.response.data.details) {
          if (typeof error.response.data.details === 'string') {
            details = error.response.data.details;
          } else {
            details = `Detalhes: ${JSON.stringify(error.response.data.details).substring(0, 100)}`;
            if (JSON.stringify(error.response.data.details).length > 100) {
              details += '...';
            }
          }
        }
        
        // Adiciona informações do tipo de erro, se disponível
        if (error.response.data.error?.type) {
          details = details ? `${details} (${error.response.data.error.type})` : `Tipo: ${error.response.data.error.type}`;
        }
      } else if (error.message) {
        // Caso seja um erro JavaScript padrão
        message = error.message;
      }
    } catch (e) {
      // Em caso de erro ao processar o erro, usa a mensagem padrão
      console.error('Erro ao processar detalhes do erro:', e);
    }
    
    // Registra o erro completo no console para depuração
    console.error('Erro completo:', error);
    
    return { message, details, fullError: error };
  }

  /**
   * Formata uma mensagem de erro para exibição
   * @param error Objeto de erro retornado pela API
   * @returns Mensagem formatada para exibição
   */
  static getErrorMessage(error: any): string {
    const { message, details } = this.getErrorDetails(error);
    return details ? `${message}\n${details}` : message;
  }

  /**
   * Retorna um objeto de configuração para o componente message.error do Ant Design
   * @param error Objeto de erro retornado pela API
   * @returns Configuração para message.error
   */
  static getErrorConfig(error: any): { content: string; duration: number } {
    const { message, details } = this.getErrorDetails(error);
    return {
      content: details ? `${message}\n${details}` : message,
      duration: 5,
    };
  }
}
