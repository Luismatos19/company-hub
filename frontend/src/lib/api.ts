import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para cookies httpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login se não autenticado
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tipos baseados no TransformInterceptor do backend
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message?: string;
  meta?: unknown;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  activeCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  companyId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user?: User;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Invite {
  id: string;
  email: string;
  companyId: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

// API de Autenticação
export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<ApiResponse<User>>('/auth/login', {
      email,
      password,
    });
    return data.data;
  },

  signup: async (
    email: string,
    password: string,
    name?: string
  ): Promise<User> => {
    const { data } = await api.post<ApiResponse<User>>('/auth/signup', {
      email,
      password,
      name,
    });
    return data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};

// API de Empresas
export const companiesApi = {
  getAll: async (page = 1, pageSize = 10) => {
    const { data } = await api.get<
      ApiResponse<{
        data: Company[];
        meta: { total: number; page: number; pageSize: number };
      }>
    >('/companies', {
      params: { page, pageSize },
    });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Company>>(`/companies/${id}`);
    return data.data;
  },

  create: async (name: string, logo?: string) => {
    const { data } = await api.post<ApiResponse<Company>>('/companies', {
      name,
      logo,
    });
    return data.data;
  },

  select: async (id: string) => {
    const { data } = await api.post<ApiResponse<User>>(
      `/companies/${id}/select`
    );
    return data.data;
  },
};

// API de Membros
export const membershipsApi = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<Membership[]>>(`/memberships`);
    return data.data;
  },
};

// API de Convites
export const invitesApi = {
  create: async (companyId: string, email: string) => {
    const { data } = await api.post<ApiResponse<Invite>>(`/invites`, {
      companyId,
      email,
    });
    return data.data;
  },

  accept: async (token: string) => {
    const { data } = await api.post<
      ApiResponse<{
        membership: Membership;
        company: Company;
      }>
    >('/invites/accept', { token });
    return data.data;
  },
};
