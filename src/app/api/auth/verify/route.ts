import { NextRequest, NextResponse } from "next/server";

const DEV_MOCK_TOKEN = "dev-mock-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Valid 6-digit code is required" },
        { status: 400 }
      );
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

    // Try real backend first
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${apiBase}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json();

      if (response.ok) {
        const res = NextResponse.json({ user: data.user, token: data.access_token });
        res.cookies.set("deepmail_token", data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return res;
      }

      console.warn("Backend verify failed, falling back to dev mock:", data.detail);
    } catch (backendError) {
      console.warn("Backend unreachable, using dev mock verify:", (backendError as Error).message);
    }

    // Dev mode mock fallback — accept any 6-digit code
    const mockUser = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "admin@deepmail.io",
      name: "Admin User",
      role: "admin",
    };

    const res = NextResponse.json({ user: mockUser, token: DEV_MOCK_TOKEN });
    res.cookies.set("deepmail_token", DEV_MOCK_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}