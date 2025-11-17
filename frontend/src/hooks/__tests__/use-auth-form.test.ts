import { renderHook, waitFor, act } from "@testing-library/react";
import { useAuthForm } from "../use-auth-form";
import { useAuth } from "../use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";

jest.mock("../use-auth");
jest.mock("next/navigation");

const mockRouter = {
  push: jest.fn(),
};

const mockSearchParams = {
  get: jest.fn(),
};

describe("useAuthForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue(null);
  });

  it("should initialize in login mode", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());
    expect(result.current.isSignup).toBe(false);
  });

  it("should initialize in signup mode when signup param is true", () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "signup") return "true";
      return null;
    });

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());
    expect(result.current.isSignup).toBe(true);
  });

  it("should get redirect from search params", () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "redirect") return "/custom-path";
      return null;
    });

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
    });

    renderHook(() => useAuthForm());
  });

  it("should submit login form", async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      await result.current.onSubmit({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password");
  });

  it("should submit signup form", async () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "signup") return "true";
      return null;
    });

    const mockSignup = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signup: mockSignup,
    });

    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      await result.current.onSubmit({
        email: "test@example.com",
        password: "password",
        name: "Test User",
      });
    });

    expect(mockSignup).toHaveBeenCalledWith(
      "test@example.com",
      "password",
      "Test User"
    );
  });

  it("should handle ApiError", async () => {
    const mockLogin = jest.fn().mockRejectedValue(
      new ApiError("Invalid credentials", 401)
    );
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      await result.current.onSubmit({
        email: "test@example.com",
        password: "wrong",
      });
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.root).toBeDefined();
    });
  });

  it("should handle generic error", async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error("Network error"));
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      await result.current.onSubmit({
        email: "test@example.com",
        password: "password",
      });
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.root).toBeDefined();
    });
  });

  it("should switch mode from login to signup", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.switchMode();
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/login?signup=true");
  });

  it("should switch mode from signup to login", () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "signup") return "true";
      return null;
    });

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      signup: jest.fn(),
    });

    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.switchMode();
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });
});

