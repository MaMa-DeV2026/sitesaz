import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قالب‌های فروشگاهی آماده',
  description: 'مشاهده و بررسی قالب‌های آماده فروشگاهی برای مد و پوشاک، محصولات زیبایی و کالای دیجیتال.',
  alternates: { canonical: '/templates' },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
