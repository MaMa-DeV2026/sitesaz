import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پیگیری سفارش',
  description: 'پیگیری آنلاین وضعیت آماده‌سازی و تحویل سفارش فروشگاه اینترنتی با استفاده از شماره سفارش و شماره همراه.',
  alternates: { canonical: '/track' },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
