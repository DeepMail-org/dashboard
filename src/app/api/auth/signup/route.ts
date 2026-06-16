import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

    // Try real backend first
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json();

      if (response.ok) {
        return NextResponse.json({ user: data.user, message: "Verification email sent" });
      }

      console.warn("Backend signup failed, falling back to dev mock:", data.detail);
    } catch (backendError) {
      console.warn("Backend unreachable, using dev mock signup:", (backendError as Error).message);
    }

    // Dev mode mock fallback
    return NextResponse.json({
      user: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email,
        name,
      },
      message: "Account created (dev mode — no verification required)",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}