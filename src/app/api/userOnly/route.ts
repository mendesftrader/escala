//validação de token no backend
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      id: payload.id_militar,
      role: payload.role,
      identidade: payload.identidade,
    });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}