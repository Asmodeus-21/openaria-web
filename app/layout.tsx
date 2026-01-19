import React from 'react';
import '../src/index.css';

export const metadata = {
  title: 'ARIA - The World’s #1 AI Receptionist',
  description: 'ARIA handles every customer interaction so your business runs nonstop.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
