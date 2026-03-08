import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SocialHub - Ultimate Multi-Social Hub',
  description: 'Promote all your social networks in one place. Connect Instagram, TikTok, YouTube, Twitter, Facebook, WhatsApp, and Telegram.',
  keywords: ['social media', 'instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'whatsapp', 'telegram', 'social hub'],
  authors: [{ name: 'SocialHub Team' }],
  creator: 'SocialHub',
  publisher: 'SocialHub',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://socialhub.com',
    siteName: 'SocialHub',
    title: 'SocialHub - Ultimate Multi-Social Hub',
    description: 'Promote all your social networks in one place.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SocialHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialHub - Ultimate Multi-Social Hub',
    description: 'Promote all your social networks in one place.',
    images: ['/og-image.jpg'],
    creator: '@socialhub',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#ff3b3b' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              className: 'border-border',
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
