import { render, screen } from "@testing-library/react";
import { Header } from "../header";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { usePathname } from "next/navigation";
import userEvent from "@testing-library/user-event";

jest.mock("@/hooks/use-auth");
jest.mock("@/store/auth-store");
jest.mock("next/navigation");

const mockLogout = jest.fn();
const mockPush = jest.fn();

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/");
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      activeCompany: null,
    });
  });

  it("should render header with logo and navigation", () => {
    render(<Header />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Company Hub")).toBeInTheDocument();
  });

  it("should show login link when not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
  });

  it("should show logout button when authenticated", () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test",
        activeCompanyId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      activeCompany: null,
    });

    render(<Header />);
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
  });

  it("should show active company name when available", () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test",
        activeCompanyId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      activeCompany: {
        id: "1",
        name: "Test Company",
        logo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    render(<Header />);
    expect(screen.getByText(/Empresa ativa:/)).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
  });

  it("should call logout when logout button is clicked", async () => {
    const user = userEvent.setup();
    (useAuthStore as jest.Mock).mockReturnValue({
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test",
        activeCompanyId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      activeCompany: null,
    });

    render(<Header />);
    const logoutButton = screen.getByText("Sair");
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("should highlight active link", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
    render(<Header />);

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass("text-primary");
  });

  it("should not show dashboard link when not authenticated", () => {
    render(<Header />);
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });
});
