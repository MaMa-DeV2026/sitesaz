import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TEMPLATES } from '@/lib/data/mock-templates';
import { CustomizerWizard } from '@/components/customizer/CustomizerWizard';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const template = TEMPLATES.find((item) => item.slug === params.slug);
  if (!template) return { title: 'شخصی‌سازی قالب' };
  return {
    title: `شخصی‌سازی ${template.title}`,
    description: `شخصی‌سازی نام فروشگاه، رنگ‌بندی و ثبت سفارش برای ${template.title}`,
    alternates: { canonical: `/templates/${template.slug}/customize` },
  };
}

export default function CustomizePage({ params }: { params: { slug: string } }) {
  const template = TEMPLATES.find((item) => item.slug === params.slug);

  if (!template) {
    return notFound();
  }

  return (
    <main className="customize-page">
      <div>
        <p className="catalog-kicker">استودیوی شخصی‌سازی</p>
        <h1>پیش‌نمایش کن، تغییر بده، تصمیم بگیر</h1>
        <p>نام، رنگ‌ها و روش تحویل را انتخاب کن. پیش‌نویس فعلاً فقط در همین مرورگر ذخیره می‌شود؛ ثبت نهایی هم درخواست هماهنگی است، نه پرداخت.</p>
      </div>

      <CustomizerWizard
        initialConfig={template.defaultConfig}
        templateTitle={template.title}
        templatePrice={template.basePrice}
      />
    </main>
  );
}
