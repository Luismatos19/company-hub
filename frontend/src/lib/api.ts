import axios, { AxiosError } from "axios";
import type {
  ApiResponse,
  User,
  Company,
  Membership,
  Invite,
  MembershipRole,
} from "@/types";
import { API_URL } from "@/lib/constants";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  status: number | null;
  data: any | null;

  constructor(message: string, status: number | null, data?: any) {
    super(message);
    this.status = status;
    this.data = data || null;
  }
}

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status = error.response?.status || null;
    const responseData = error.response?.data as any;

    let message = "Erro desconhecido";

    if (responseData?.message) {
      message = responseData.message;
    } else if (typeof responseData === "string") {
      message = responseData;
    } else if (responseData?.error) {
      message = responseData.error;
    } else if (error.message) {
      message = error.message;
    }

    const data = error.response?.data || null;

    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/accept-invite") &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/signup")
    ) {
      window.location.href = "/login";
    }

    throw new ApiError(message, status, data);
  }
);

async function handleRequest<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Erro desconhecido", null, error);
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    handleRequest<User>(api.post("/auth/login", { email, password })),

  signup: (email: string, password: string, name?: string) =>
    handleRequest<User>(api.post("/auth/signup", { email, password, name })),

  logout: () => handleRequest(api.post("/auth/logout")),
};

export const companiesApi = {
  getAll: (page = 1, pageSize = 10) =>
    handleRequest<Company[]>(
      api.get("/companies", { params: { page, pageSize } })
    ),

  getById: (id: string) => handleRequest<Company>(api.get(`/companies/${id}`)),

  create: (name: string, logo?: string) =>
    handleRequest<Company>(api.post("/companies", { name, logo })),

  select: (id: string) =>
    handleRequest<User>(api.post(`/companies/${id}/select`)),

  update: (id: string, name: string) =>
    handleRequest<Company>(api.patch(`/companies/${id}`, { name })),

  delete: (id: string) => handleRequest(api.delete(`/companies/${id}`)),
};

export const membershipsApi = {
  getAll: () => handleRequest<Membership[]>(api.get("/memberships")),

  update: (id: string, role: MembershipRole) =>
    handleRequest<Membership>(api.patch(`/memberships/${id}`, { role })),

  delete: (id: string) => handleRequest(api.delete(`/memberships/${id}`)),
};

export const invitesApi = {
  create: (companyId: string, email: string, expiresAt: string) =>
    handleRequest<Invite>(
      api.post("/invites", { companyId, email, expiresAt })
    ),

  getByToken: (token: string) =>
    handleRequest<Invite>(api.get(`/invites/token/${token}`)),

  accept: (token: string) =>
    handleRequest<{
      membership: Membership;
      company: Company;
    }>(api.post("/invites/accept", { token })),
};

export type { User, Company, Membership, Invite, ApiResponse, MembershipRole };
