import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Event Calendar',
  description: 'Event Calendar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <Head>
          <script src='https://cdn.onesignal.com/sdks/OneSignalSDK.js' async={true}></script>
        </Head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
