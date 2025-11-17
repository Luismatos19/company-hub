import axios from "axios";
import type { User, Company, Membership, Invite } from "@/types";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create antes de importar api
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
};

mockedAxios.create = jest.fn(() => mockAxiosInstance as any);

// Helper para resetar os mocks
const resetMocks = () => {
  jest.clearAllMocks();
  mockAxiosInstance.get.mockClear();
  mockAxiosInstance.post.mockClear();
  mockAxiosInstance.patch.mockClear();
  mockAxiosInstance.delete.mockClear();
};

// Importar api após mockar axios.create
import { api, ApiError, authApi, companiesApi, membershipsApi, invitesApi } from "../api";

describe("ApiError", () => {
  it("should create error with message and status", () => {
    const error = new ApiError("Test error", 400);
    expect(error.message).toBe("Test error");
    expect(error.status).toBe(400);
    expect(error.data).toBeNull();
  });

  it("should create error with data", () => {
    const data = { field: "value" };
    const error = new ApiError("Test error", 400, data);
    expect(error.data).toEqual(data);
  });
});

describe("api interceptor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    window.location = { href: "", pathname: "/dashboard" } as any;
  });

  it("should throw ApiError on axios error", async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: { message: "Bad request" },
      },
      message: "Request failed",
    };
    
    mockAxiosInstance.post.mockRejectedValue(errorResponse);

    await expect(
      authApi.login("test@example.com", "password")
    ).rejects.toThrow(ApiError);
  });

  it("should redirect to login on 401 error", async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { href: "", pathname: "/dashboard" } as any;

    const errorResponse = {
      response: {
        status: 401,
        data: { message: "Unauthorized" },
      },
      message: "Unauthorized",
    };

    mockAxiosInstance.post.mockRejectedValue(errorResponse);

    try {
      await authApi.login("test@example.com", "password");
    } catch (e) {
      // Esperado que o interceptor redirecione
    }

    expect(window.location.href).toBe("/login");
    window.location = originalLocation;
  });
});

describe("authApi", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should call login endpoint", async () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      name: "Test",
      activeCompanyId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAxiosInstance.post.mockResolvedValue({ data: mockUser });

    await authApi.login("test@example.com", "password");
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "password",
    });
  });

  it("should call signup endpoint", async () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      name: "Test",
      activeCompanyId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAxiosInstance.post.mockResolvedValue({ data: mockUser });

    await authApi.signup("test@example.com", "password", "Test");
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/auth/signup", {
      email: "test@example.com",
      password: "password",
      name: "Test",
    });
  });

  it("should call logout endpoint", async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: {} });

    await authApi.logout();
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/auth/logout");
  });
});

describe("companiesApi", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should call getAll with pagination", async () => {
    const mockCompanies: Company[] = [];
    mockAxiosInstance.get.mockResolvedValue({ data: mockCompanies });

    await companiesApi.getAll(1, 10);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/companies", {
      params: { page: 1, pageSize: 10 },
    });
  });

  it("should call getById", async () => {
    const mockCompany: Company = {
      id: "1",
      name: "Test",
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockCompany });

    await companiesApi.getById("1");
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/companies/1");
  });

  it("should call create", async () => {
    const mockCompany: Company = {
      id: "1",
      name: "Test",
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockCompany });

    await companiesApi.create("Test", "logo.png");
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/companies", {
      name: "Test",
      logo: "logo.png",
    });
  });

  it("should call update", async () => {
    const mockCompany: Company = {
      id: "1",
      name: "Updated",
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAxiosInstance.patch.mockResolvedValue({ data: mockCompany });

    await companiesApi.update("1", "Updated");
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith("/companies/1", { name: "Updated" });
  });

  it("should call delete", async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: {} });

    await companiesApi.delete("1");
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/companies/1");
  });
});

describe("membershipsApi", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should call getAll", async () => {
    const mockMemberships: Membership[] = [];
    mockAxiosInstance.get.mockResolvedValue({ data: mockMemberships });

    await membershipsApi.getAll();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/memberships");
  });

  it("should call update", async () => {
    const mockMembership: Membership = {
      id: "1",
      userId: "1",
      companyId: "1",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAxiosInstance.patch.mockResolvedValue({ data: mockMembership });

    await membershipsApi.update("1", "ADMIN");
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith("/memberships/1", { role: "ADMIN" });
  });

  it("should call delete", async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: {} });

    await membershipsApi.delete("1");
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/memberships/1");
  });
});

describe("invitesApi", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should call create", async () => {
    const mockInvite: Invite = {
      id: "1",
      email: "test@example.com",
      companyId: "1",
      token: "token",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockInvite });

    await invitesApi.create("1", "test@example.com", new Date().toISOString());
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/invites", {
      companyId: "1",
      email: "test@example.com",
      expiresAt: expect.any(String),
    });
  });

  it("should call accept", async () => {
    const mockResponse = {
      membership: {} as Membership,
      company: {} as Company,
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

    await invitesApi.accept("token");
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/invites/accept", { token: "token" });
  });
});

