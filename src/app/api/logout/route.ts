import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado" });

  // remove o cookie do token
  response.cookies.delete("token");

  return response;
}