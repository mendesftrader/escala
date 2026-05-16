import db from "../../../backend/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  const { novaSenha } = await req.json();
  
    const token = req.cookies.get("token")?.value;
    console.log("Token recebido:", token);

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.id_militar;
    // validação simples de senha
    if (!novaSenha || novaSenha.length < 6) { //mais a frente incluir a obrigação de números, símbolos e letras maísculas.
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    const senhaHash = await bcrypt.hash(novaSenha, 3); //criptografa a senha, salt rounds igual a 3, quanto maior mais pesado e lento, desejável salt round 10
    console.log("USER ID:", userId);
    await db.query(
      `UPDATE militares 
       SET senha = ?, primeiro_login = false 
       WHERE id_militar = ?`,
      [senhaHash, userId]
    );

    // cria token para o primeiro login, permite ao usuário logar com senha pré definida e alterá-la
    const novoToken = await new SignJWT({
        id: payload.id,
        identidade: payload.identidade,
        primeiro_login: false, 
    })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

    const response = NextResponse.json({
      message: "Senha alterada com sucesso",
    });

    response.cookies.set("token", novoToken, { // salva o cookie no navegador e deixa o usuário logado
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/", //permite o acesso a todo site
      maxAge: 60 * 60 * 24, //validade de um dia
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }
}