//ESTE LAYOUT É GLOBAL

// criar uma forma de transição mais suave entre as rotas se possível
//ORGANIZAR MELHOR O LAYOUT DAS PÁGINAS

import './globals.css' //importa as configurações de body para todas as rotas

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        {children}
      </body>
    </html>
  );
}
