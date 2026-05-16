// (-_-)

import db from "../../../backend/db"; 
import bcrypt from "bcryptjs";// biblioetca para comparar senhas criptografadas 
import { quatroDigitos } from "../../../backend/quatrodigitos";
import { NextRequest } from "next/server"; 
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

// interface que define o formato esperado do corpo da requisição, tipagem do TYPESCRIPT
interface LoginBody {
  identidade: string;
  senha: string;
}

// interface que define o formato de um usuário vindo do banco, tipagem do TYPESCRIPT
interface Militar extends RowDataPacket {
  id_militar: number;
  identidade: string;
  senha: string;
  role: string;
  primeiro_login: boolean;
}

export async function POST(req: NextRequest) {
  // converte o corpo da requisição para JSON e aplica tipagem
  const { identidade, senha }: LoginBody = await req.json();

  // busca o usuário pela IDT no BD
  const [militares] = await db.query<Militar[]>(
    "SELECT * FROM militares WHERE identidade = ?",
    [identidade]
  );

  // confirma que o usuário exista
  if (militares.length === 0) {
    return Response.json(
      { error: "Identidade ou senha inválida" },
      { status: 401 }//erro 401 (não autorizado)
    );
    
  }

  // pega o primeiro usuário retornado
  const militar = militares[0];
  console.log("MILITAR:", militar);
  let senhaValida = false;
  if(militar.primeiro_login){
    const senhaInicial = quatroDigitos(militar.identidade); //caso seja o primeiro login usar os últimos 4 digitos da idt como login inicial
    senhaValida = senha === senhaInicial;
  }else{
    senhaValida = await bcrypt.compare(senha, militar.senha);
  }
  if(!senhaValida){
    return NextResponse.json(
      {error:"Identidade ou senha inválida"},
      {status: 401}
    )
  }

  // cria o token JWT contendo informações do usuário
  const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);//salva a varial criada como chave secreta
  const token = await new SignJWT({
    id_militar: militar.id_militar,
    identidade: militar.identidade,
    role: militar.role,
    primeiro_login: Boolean(militar.primeiro_login), 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d") //token dura 24 horas, em um ambiente controlado é o suficiente
    .sign(secret); //assina o token para validá-lo

  const response = NextResponse.json({ message: "Login ok", primeiro_login: militar.primeiro_login });
    response.cookies.set("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/", //permite usar o token em todo o código
      maxAge: 60 * 60, // 1 hora
    });
  return response;
}