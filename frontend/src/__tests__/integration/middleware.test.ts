import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../../../middleware";

jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({ type: "next" })),
    redirect: jest.fn((url) => ({ type: "redirect", url })),
  },
}));

describe("Middleware Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access to dashboard with access token", () => {
    const request = {
      nextUrl: {
        pathname: "/dashboard",
        searchParams: {
          set: jest.fn(),
        },
      },
      cookies: {
        get: jest.fn(() => ({ value: "token123" })),
      },
      url: "http://localhost:3000/dashboard",
    } as unknown as NextRequest;

    const response = middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("should redirect to login when accessing dashboard without token", () => {
    const request = {
      nextUrl: {
        pathname: "/dashboard",
        searchParams: {
          set: jest.fn(),
        },
      },
      cookies: {
        get: jest.fn(() => undefined),
      },
      url: "http://localhost:3000/dashboard",
    } as unknown as NextRequest;

    const response = middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it("should redirect to login with redirect parameter", () => {
    const setSpy = jest.fn();
    const request = {
      nextUrl: {
        pathname: "/dashboard/company/123",
        searchParams: {
          set: setSpy,
        },
      },
      cookies: {
        get: jest.fn(() => undefined),
      },
      url: "http://localhost:3000/dashboard/company/123",
    } as unknown as NextRequest;

    middleware(request);

    expect(setSpy).toHaveBeenCalledWith("redirect", "/dashboard/company/123");
  });

  it("should allow access to non-dashboard routes", () => {
    const request = {
      nextUrl: {
        pathname: "/",
      },
      cookies: {
        get: jest.fn(),
      },
      url: "http://localhost:3000/",
    } as unknown as NextRequest;

    const response = middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
  });
});

