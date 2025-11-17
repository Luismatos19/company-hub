import { renderHook, waitFor } from "@testing-library/react";
import { useCompanyDetails } from "../use-company-details";
import { companiesApi } from "@/lib/api";
import type { Company, Membership } from "@/types";

jest.mock("@/lib/api");

const mockCompany: Company = {
  id: "1",
  name: "Test Company",
  logo: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  memberships: [
    {
      id: "1",
      userId: "1",
      companyId: "1",
      role: "OWNER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

describe("useCompanyDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should load company details successfully", async () => {
    (companiesApi.getById as jest.Mock).mockResolvedValue(mockCompany);

    const { result } = renderHook(() => useCompanyDetails("1"));

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.company).toEqual(mockCompany);
    expect(result.current.members).toEqual(mockCompany.memberships);
    expect(result.current.error).toBeNull();
  });

  it("should handle loading state", () => {
    (companiesApi.getById as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useCompanyDetails("1"));

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle error state", async () => {
    const error = new Error("Failed to load company");
    (companiesApi.getById as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCompanyDetails("1"));

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.company).toBeNull();
    expect(result.current.members).toEqual([]);
  });

  it("should not load when enabled is false", () => {
    renderHook(() => useCompanyDetails("1", false));

    jest.advanceTimersByTime(200);

    expect(companiesApi.getById).not.toHaveBeenCalled();
  });

  it("should refetch company details", async () => {
    (companiesApi.getById as jest.Mock).mockResolvedValue(mockCompany);

    const { result } = renderHook(() => useCompanyDetails("1"));

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(async () => {
      await result.current.refetch();
    });

    expect(companiesApi.getById).toHaveBeenCalledTimes(2);
  });

  it("should handle company without memberships", async () => {
    const companyWithoutMemberships: Company = {
      ...mockCompany,
      memberships: undefined,
    };
    (companiesApi.getById as jest.Mock).mockResolvedValue(
      companyWithoutMemberships
    );

    const { result } = renderHook(() => useCompanyDetails("1"));

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.members).toEqual([]);
  });
});

