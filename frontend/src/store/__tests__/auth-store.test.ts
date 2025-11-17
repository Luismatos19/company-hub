import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../auth-store";
import type { User, Company } from "@/types";

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

describe("useAuthStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should initialize with null user", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.activeCompany).toBeNull();
    expect(result.current.companies).toEqual([]);
  });

  it("should set user", () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(mockUser);
    });
    expect(result.current.user).toEqual(mockUser);
  });

  it("should set active company", () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setActiveCompany(mockCompany);
    });
    expect(result.current.activeCompany).toEqual(mockCompany);
  });

  it("should set companies", () => {
    const { result } = renderHook(() => useAuthStore());
    const companies = [mockCompany];
    act(() => {
      result.current.setCompanies(companies);
    });
    expect(result.current.companies).toEqual(companies);
  });

  it("should logout and clear all state", () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(mockUser);
      result.current.setActiveCompany(mockCompany);
      result.current.setCompanies([mockCompany]);
    });
    act(() => {
      result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.activeCompany).toBeNull();
    expect(result.current.companies).toEqual([]);
  });

  it("should persist state to localStorage", () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(mockUser);
      result.current.setActiveCompany(mockCompany);
    });
    const stored = localStorage.getItem("auth-storage");
    expect(stored).toBeTruthy();
  });
});
