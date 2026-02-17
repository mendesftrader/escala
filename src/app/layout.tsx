import * as React from 'react';
import MuiProvider from '../theme/MuiProvider';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <MuiProvider>
          {props.children}
        </MuiProvider>
      </body>
    </html>
  );
}


