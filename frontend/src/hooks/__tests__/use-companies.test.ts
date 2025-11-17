import { renderHook, waitFor } from "@testing-library/react";
import { useCompanies } from "../use-companies";
import { companiesApi } from "@/lib/api";
import type { Company } from "@/types";

jest.mock("@/lib/api");

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

describe("useCompanies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load companies successfully", async () => {
    (companiesApi.getAll as jest.Mock).mockResolvedValue(mockCompanies);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toEqual(mockCompanies);
    expect(result.current.error).toBeNull();
    expect(companiesApi.getAll).toHaveBeenCalledWith(1, 10);
  });

  it("should handle loading state", () => {
    (companiesApi.getAll as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useCompanies());

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle error state", async () => {
    const error = new Error("Failed to load companies");
    (companiesApi.getAll as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.companies).toEqual([]);
  });

  it("should use custom page and pageSize", async () => {
    (companiesApi.getAll as jest.Mock).mockResolvedValue(mockCompanies);

    renderHook(() => useCompanies({ page: 2, pageSize: 20 }));

    await waitFor(() => {
      expect(companiesApi.getAll).toHaveBeenCalledWith(2, 20);
    });
  });

  it("should not load when enabled is false", () => {
    renderHook(() => useCompanies({ enabled: false }));

    expect(companiesApi.getAll).not.toHaveBeenCalled();
  });

  it("should refetch when page changes", async () => {
    (companiesApi.getAll as jest.Mock).mockResolvedValue(mockCompanies);

    const { rerender } = renderHook(
      ({ page }) => useCompanies({ page }),
      {
        initialProps: { page: 1 },
      }
    );

    await waitFor(() => {
      expect(companiesApi.getAll).toHaveBeenCalledWith(1, 10);
    });

    rerender({ page: 2 });

    await waitFor(() => {
      expect(companiesApi.getAll).toHaveBeenCalledWith(2, 10);
    });
  });
});

