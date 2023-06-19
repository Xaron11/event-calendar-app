import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { TrpcProvider } from '@/utils/trpc-provider';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Event Calendar',
  description: 'Event Calendar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <ClerkProvider>
        <html lang='en'>
          <body className={inter.className}>{children}</body>
        </html>
      </ClerkProvider>
    </TrpcProvider>
  );
}
