import db from "../../../backend/db"; 
import bcrypt from "bcryptjs";// biblioetca para comparar senhas criptografadas 
import jwt from "jsonwebtoken";// gera tokens JWT para o login
import { NextRequest } from "next/server"; 
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// interface que define o formato esperado do corpo da requisição, tipagem do TYPESCRIPT
interface LoginBody {
  identidade: string;
  senha: string;
}

// interface que define o formato de um usuário vindo do banco, tipagem do TYPESCRIPT
interface Militar extends RowDataPacket {
  id: number;
  identidade: string;
  senha: string;
  role: string;
}

export async function POST(req: NextRequest) {
  // converte o corpo da requisição para JSON e aplica tipagem
  const { identidade, senha }: LoginBody = await req.json();

  // busca o usuário pelo nome no BD
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
  // compara a senha digitada com a senha criptografada do banco
  const senhaValida = await bcrypt.compare(senha, militar.senha);
  //senha incorreta
  if (!senhaValida) {
    return Response.json(
      { error: "Senha inválida" },
      { status: 401 }
    );
  }
  // cria o token JWT contendo informações do usuário
  const token = jwt.sign(
    {
      id: militar.id,
      role: militar.role,
      identidade: militar.identidade,
    },
    process.env.JWT_SECRET as string, 
    // chave secreta usada para assinar o token (vinda do .env)
    { expiresIn: "1d" } 
    // o token expira em 1 dia, após isso o militar deve fazer o login novamente, 
    // como o sistema é localhost um dia é um prazo razoável e não oferece riscos
  );
  const response = NextResponse.json({ message: "Login ok" });
    response.cookies.set("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    });
  return response;
}