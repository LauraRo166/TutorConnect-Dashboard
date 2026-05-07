import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TutorConnect — Panel Admin',
  description: 'Dashboard de métricas y KPIs para TutorConnect',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
        <body className="min-h-full bg-background text-foreground">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
