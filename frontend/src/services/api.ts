import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface Plant {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  locationDescription: string;
  plantId: string;
  plant?: Plant;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  serialNumber: string;
  initialOperationsDate: string;
  areaId: string;
  area?: Area;
  areas?: Area[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AreaNeighbor {
  id: string;
  areaId: string;
  neighborAreaId: string;
  area?: Area;
  neighborArea?: Area;
  createdByUserId: string;
  updatedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentArea {
  id: string;
  equipmentId: string;
  areaId: string;
  equipment?: Equipment;
  area?: Area;
  createdByUserId?: string; // Agora opcional, será adicionado automaticamente pelo backend
  updatedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PartType {
  ELECTRIC = "electric",
  ELECTRONIC = "electronic",
  MECHANICAL = "mechanical",
  HYDRAULICAL = "hydraulical"
}

export interface Part {
  id: string;
  name: string;
  type: PartType;
  manufacturer: string;
  serialNumber: string;
  installationDate: string;
  equipmentId: string;
  equipment?: Equipment;
  createdAt: string;
  updatedAt: string;
}

export const plantApi = {
  getAll: () => api.get<Plant[]>('/plants'),
  getById: (id: string) => api.get<Plant>(`/plants/${id}`),
  create: (data: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Plant>('/plants', data),
  update: (id: string, data: Partial<Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Plant>(`/plants/${id}`, data),
  delete: (id: string) => api.delete(`/plants/${id}`),
};

export const areaApi = {
  getAll: () => api.get<Area[]>('/areas'),
  getById: (id: string) => api.get<Area>(`/areas/${id}`),
  create: (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Area>('/areas', data),
  update: (id: string, data: Partial<Omit<Area, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Area>(`/areas/${id}`, data),
  delete: (id: string) => api.delete(`/areas/${id}`),
};

export const equipmentApi = {
  getAll: () => api.get<Equipment[]>('/equipment'),
  getById: (id: string) => api.get<Equipment>(`/equipment/${id}`),
  create: (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Equipment>('/equipment', data),
  update: (id: string, data: Partial<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Equipment>(`/equipment/${id}`, data),
  delete: (id: string) => api.delete(`/equipment/${id}`),
};

export const partApi = {
  getAll: () => api.get<Part[]>('/parts'),
  getById: (id: string) => api.get<Part>(`/parts/${id}`),
  create: (data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Part>('/parts', data),
  update: (id: string, data: Partial<Omit<Part, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Part>(`/parts/${id}`, data),
  delete: (id: string) => api.delete(`/parts/${id}`),
};

export const areaNeighborApi = {
  getAll: () => api.get<AreaNeighbor[]>('/area-neighbors'),
  getByAreaId: (areaId: string) => api.get<AreaNeighbor[]>(`/area-neighbors?areaId=${areaId}`),
  getById: (id: string) => api.get<AreaNeighbor>(`/area-neighbors/${id}`),
  create: (data: Omit<AreaNeighbor, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<AreaNeighbor>('/area-neighbors', data),
  update: (id: string, data: Partial<Omit<AreaNeighbor, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<AreaNeighbor>(`/area-neighbors/${id}`, data),
  delete: (id: string) => api.delete(`/area-neighbors/${id}`),
};

export const equipmentAreaApi = {
  getAll: () => api.get<EquipmentArea[]>('/equipment-areas'),
  getByEquipmentId: (equipmentId: string) => api.get<EquipmentArea[]>(`/equipment-areas?equipmentId=${equipmentId}`),
  getByAreaId: (areaId: string) => api.get<EquipmentArea[]>(`/equipment-areas?areaId=${areaId}`),
  getById: (id: string) => api.get<EquipmentArea>(`/equipment-areas/${id}`),
  create: (data: Pick<EquipmentArea, 'equipmentId' | 'areaId'>) =>
    api.post<EquipmentArea>('/equipment-areas', data),
  update: (id: string, data: Partial<Pick<EquipmentArea, 'equipmentId' | 'areaId'>>) =>
    api.put<EquipmentArea>(`/equipment-areas/${id}`, data),
  delete: (id: string) => api.delete(`/equipment-areas/${id}`),
};

export const userApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/users/login', data),
  me: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    return api.get<User>('/users/me', config);
  },
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => api.post<User>('/users', data),
  update: (id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  changePassword: (userId: string, data: { currentPassword: string; newPassword: string }) => 
    api.put(`/users/${userId}/password`, data),
  toggleStatus: (userId: string, isActive: boolean) => 
    api.put(`/users/${userId}/status`, { isActive }),
};