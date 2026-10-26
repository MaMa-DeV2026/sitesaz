import type { Metadata } from 'next';
import './globals.css';
import './direct-redesign.css';
import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    default: 'سایت‌ساز | سایت حرفه‌ای کسب‌وکار، با هزینه کمتر',
    template: '%s | سایت‌ساز',
  },
  description: 'سایت آماده‌ی کسب‌وکار خود را ببینید، بخش‌های پشتیبانی‌شده را شخصی‌سازی کنید و روش تحویل مناسب‌تان را انتخاب کنید.',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'دایرکت وب',
    title: 'سایت‌ساز | سایت حرفه‌ای کسب‌وکار، با هزینه کمتر',
    description: 'بازارچه‌ی سایت‌های آماده با پیش‌نمایش و شخصی‌سازی ساختاریافته.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

