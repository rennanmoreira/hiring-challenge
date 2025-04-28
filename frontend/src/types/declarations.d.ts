// Declarações de tipos para bibliotecas externas
declare module "react" {
  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ): T;
  export function useRef<T>(initialValue: T): { current: T };
  export const Fragment: any;
  export const createContext: any;
  export const useContext: any;
}

declare module "antd" {
  export const Form: any;
  export const Input: any;
  export const Button: any;
  export const Select: any;
  export const DatePicker: any;
  export const Table: any;
  export const Space: any;
  export const Card: any;
  export const Typography: any;
  export const Modal: any;
  export const message: any;
  export const Tooltip: any;
  export const Popconfirm: any;
  export const Tag: any;
  export type TableProps<T> = any;
}

declare module "react-query" {
  export function useQuery(key: any, fn: any, options?: any): any;
  export function useMutation(fn: any, options?: any): any;
  export function useQueryClient(): any;
}

declare module "@ant-design/icons" {
  export const PlusOutlined: any;
  export const DeleteOutlined: any;
  export const EditOutlined: any;
  export const LinkOutlined: any;
  export const RightOutlined: any;
  export const NodeIndexOutlined: any;
}

declare module "dayjs" {
  const dayjs: any;
  export default dayjs;
}

declare module "next/navigation" {
  export function useRouter(): any;
  export function useSearchParams(): any;
}

// Declaração para o process.env no Next.js
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    // Adicione outras variáveis de ambiente conforme necessário
  }
}

declare module "axios" {
  export interface AxiosRequestConfig {
    baseURL?: string;
    headers?: Record<string, string>;
  }

  export interface AxiosInstance {
    get: <T>(url: string, config?: any) => Promise<{ data: T }>;
    post: <T>(url: string, data: any, config?: any) => Promise<{ data: T }>;
    put: <T>(url: string, data: any, config?: any) => Promise<{ data: T }>;
    delete: (url: string, config?: any) => Promise<any>;
    interceptors: {
      request: {
        use: (fn: (config: any) => any) => void;
      };
    };
  }

  export function create(config: AxiosRequestConfig): AxiosInstance;

  const axios: {
    create: typeof create;
  };

  export default axios;
}
