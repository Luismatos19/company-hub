import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { companiesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useCompanies } from "@/hooks/use-companies";
import type { Company } from "@/types";

jest.mock("next/navigation");
jest.mock("@/lib/api");
jest.mock("@/store/auth-store");

const mockRouter = {
  push: jest.fn(),
};

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Company 1",
    logo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Company 2",
    logo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe("Company Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should load companies list", async () => {
    (companiesApi.getAll as jest.Mock).mockResolvedValue(mockCompanies);
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
      companies: [],
    });

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toEqual(mockCompanies);
    expect(companiesApi.getAll).toHaveBeenCalled();
  });

  it("should handle pagination", async () => {
    (companiesApi.getAll as jest.Mock).mockResolvedValue(mockCompanies);

    const { result } = renderHook(() => useCompanies({ page: 2, pageSize: 5 }));

    await waitFor(() => {
      expect(companiesApi.getAll).toHaveBeenCalledWith(2, 5);
    });
  });

  it("should handle error when loading companies", async () => {
    const error = new Error("Failed to load companies");
    (companiesApi.getAll as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.companies).toEqual([]);
  });
});
