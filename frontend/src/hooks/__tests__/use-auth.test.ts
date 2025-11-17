import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../use-auth";
import { authApi, companiesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import type { User, Company } from "@/types";

jest.mock("@/lib/api");
jest.mock("@/store/auth-store");
jest.mock("next/navigation");

const mockRouter = {
  push: jest.fn(),
};

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  activeCompanyId: "company-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockCompany: Company = {
  id: "company-1",
  name: "Test Company",
  logo: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      setUser: jest.fn(),
      setActiveCompany: jest.fn(),
      setCompanies: jest.fn(),
      logout: jest.fn(),
    });
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should login successfully", async () => {
    (authApi.login as jest.Mock).mockResolvedValue(mockUser);
    (companiesApi.getAll as jest.Mock).mockResolvedValue([mockCompany]);

    const setUser = jest.fn();
    const setActiveCompany = jest.fn();
    const setCompanies = jest.fn();

    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      setUser,
      setActiveCompany,
      setCompanies,
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(authApi.login).toHaveBeenCalledWith("test@example.com", "password");
    expect(setUser).toHaveBeenCalledWith(mockUser);
    expect(companiesApi.getAll).toHaveBeenCalled();
    expect(setCompanies).toHaveBeenCalledWith([mockCompany]);
    expect(setActiveCompany).toHaveBeenCalledWith(mockCompany);
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle login error", async () => {
    const error = new Error("Login failed");
    (authApi.login as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.login("test@example.com", "password")
    ).rejects.toThrow("Login failed");
  });

  it("should signup successfully", async () => {
    (authApi.signup as jest.Mock).mockResolvedValue(mockUser);

    const setUser = jest.fn();

    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      setUser,
      setActiveCompany: jest.fn(),
      setCompanies: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(async () => {
      await result.current.signup("test@example.com", "password", "Test User");
    });

    expect(authApi.signup).toHaveBeenCalledWith(
      "test@example.com",
      "password",
      "Test User"
    );
    expect(setUser).toHaveBeenCalledWith(mockUser);
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle signup error", async () => {
    const error = new Error("Signup failed");
    (authApi.signup as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.signup("test@example.com", "password", "Test User")
    ).rejects.toThrow("Signup failed");
  });

  it("should logout successfully", async () => {
    const logoutStore = jest.fn();
    (authApi.logout as jest.Mock).mockResolvedValue({});

    delete (window as any).location;
    window.location = { href: "" } as any;

    (useAuthStore as jest.Mock).mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      setActiveCompany: jest.fn(),
      setCompanies: jest.fn(),
      logout: logoutStore,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(async () => {
      await result.current.logout();
    });

    expect(authApi.logout).toHaveBeenCalled();
    expect(logoutStore).toHaveBeenCalled();
  });

  it("should load user companies", async () => {
    (companiesApi.getAll as jest.Mock).mockResolvedValue([mockCompany]);

    const setCompanies = jest.fn();
    const setActiveCompany = jest.fn();

    (useAuthStore as jest.Mock).mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      setActiveCompany,
      setCompanies,
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(async () => {
      await result.current.loadUserCompanies();
    });

    expect(companiesApi.getAll).toHaveBeenCalled();
    expect(setCompanies).toHaveBeenCalledWith([mockCompany]);
    expect(setActiveCompany).toHaveBeenCalledWith(mockCompany);
  });

  it("should return isAuthenticated as true when user exists", () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      setActiveCompany: jest.fn(),
      setCompanies: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });
});

