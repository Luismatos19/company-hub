import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page";
import { authApi, companiesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { User, Company } from "@/types";

jest.mock("next/navigation");
jest.mock("@/lib/api");
jest.mock("@/store/auth-store");

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
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

describe("Auth Flow Integration", () => {
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

  describe("Login Flow", () => {
    it("should complete login flow successfully", async () => {
      const user = userEvent.setup();
      const setUser = jest.fn();
      const setActiveCompany = jest.fn();
      const setCompanies = jest.fn();

      (authApi.login as jest.Mock).mockResolvedValue(mockUser);
      (companiesApi.getAll as jest.Mock).mockResolvedValue([mockCompany]);
      (useAuthStore as jest.Mock).mockReturnValue({
        user: null,
        setUser,
        setActiveCompany,
        setCompanies,
        logout: jest.fn(),
      });

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /entrar/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
      });

      await waitFor(() => {
        expect(setUser).toHaveBeenCalledWith(mockUser);
      });

      await waitFor(() => {
        expect(companiesApi.getAll).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(setCompanies).toHaveBeenCalledWith([mockCompany]);
      });

      await waitFor(() => {
        expect(setActiveCompany).toHaveBeenCalledWith(mockCompany);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should handle login error and display message", async () => {
      const user = userEvent.setup();
      const error = new Error("Invalid credentials");

      (authApi.login as jest.Mock).mockRejectedValue(error);

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /entrar/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe("Signup Flow", () => {
    it("should complete signup flow successfully", async () => {
      const user = userEvent.setup();
      const setUser = jest.fn();

      (authApi.signup as jest.Mock).mockResolvedValue(mockUser);
      (useAuthStore as jest.Mock).mockReturnValue({
        user: null,
        setUser,
        setActiveCompany: jest.fn(),
        setCompanies: jest.fn(),
        logout: jest.fn(),
      });

      Object.defineProperty(window, "location", {
        value: {
          search: "?signup=true",
        },
        writable: true,
      });

      const mockSearchParams = {
        get: (key: string) => (key === "signup" ? "true" : null),
      };

      jest.spyOn(require("next/navigation"), "useSearchParams").mockReturnValue(
        mockSearchParams
      );

      render(<LoginPage />);

      const nameInput = screen.getByPlaceholderText("Seu nome");
      const emailInput = screen.getByPlaceholderText("seu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /criar conta/i });

      await user.type(nameInput, "Test User");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(authApi.signup).toHaveBeenCalledWith(
          "test@example.com",
          "password123",
          "Test User"
        );
      });

      await waitFor(() => {
        expect(setUser).toHaveBeenCalledWith(mockUser);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Mode Switching", () => {
    it("should switch from login to signup mode", async () => {
      const user = userEvent.setup();

      render(<LoginPage />);

      const switchButton = screen.getByText(/criar conta/i);
      await user.click(switchButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/login?signup=true");
      });
    });

    it("should switch from signup to login mode", async () => {
      const user = userEvent.setup();

      const mockSearchParams = {
        get: (key: string) => (key === "signup" ? "true" : null),
      };

      jest.spyOn(require("next/navigation"), "useSearchParams").mockReturnValue(
        mockSearchParams
      );

      render(<LoginPage />);

      const switchButton = screen.getByText(/fazer login/i);
      await user.click(switchButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/login");
      });
    });
  });
});

