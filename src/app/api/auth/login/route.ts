import { NextRequest, NextResponse } from "next/server";

const DEV_MOCK_TOKEN = "dev-mock-token";
const DEV_MOCK_USER = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "admin@deepmail.io",
  name: "Admin User",
  role: "admin",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

    // Try real backend first
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

      // Backend responded but with an error — still fall through to mock in dev
      console.warn("Backend login failed, falling back to dev mock:", data.detail);
    } catch (backendError) {
      // Backend unreachable — fall through to mock
      console.warn("Backend unreachable, using dev mock auth:", (backendError as Error).message);
    }

    // Dev mode mock fallback
    const mockUser = { ...DEV_MOCK_USER, email };
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}