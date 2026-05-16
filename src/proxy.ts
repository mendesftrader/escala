import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  // função principal do middleware, executada a cada requisição nas rotas configuradas
  console.log("Middleware rodando:", request.nextUrl.pathname);

  const token = request.cookies.get("token")?.value;
  // pega o token armazenado no cookie chamado "token"
  // O ?.value evita erro caso o cookie não exista


  const adminRoutes = ["/militares", "/cadastro"]
  const publicRoutes = ["/login"]; //libera rotas no midleware
  // Rotas são públicas (não precisam de autenticação)
  // Ex: página de login
  //nenhuma rota pública com exceção do login
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  // se a rota for pública, permite o acesso normalmente
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
    // se NÃO existir token, redireciona o usuário para a página de login
  }

  try {
   const secret = new TextEncoder().encode(process.env.JWT_SECRET as string) ; //gera tokens válidos para as próximas requisições
    const {payload} = await jwtVerify(token, secret);
    if(payload.primeiro_login){
      if(request.nextUrl.pathname !== "/primeiro-acesso"){
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    if(adminRoutes.includes(request.nextUrl.pathname)){
      if(payload.role !== "admin"){
        return NextResponse.redirect(new URL("/previsao", request.url));
      }
    }
    return NextResponse.next();
    // se o token for válido, permite o acesso à rota
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL("/login", request.url));
    // se o token for inválido ou expirado, redireciona para login
  }
}

/////////////////////// IMPORTANTE CONFERIR CADA ROTA, TENTANDO FAZER O ACESSO SEM LOGIN ///////////////////////
// quais rotas o middleware irá proteger
export const config = {
  matcher: ["/militares", "/previsao", "/inativo", "/cadastro", "/consulta", "/gerarEscala" ]
  // O middleware só será executado nessas rotas
  //"/:path*" - use para testar o milddleware quando preciso
  //"/api:/path*" bloqueia todas as API
};

