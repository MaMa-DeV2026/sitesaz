import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { StorefrontPreview } from '@/components/templates/StorefrontPreview';
import { TEMPLATES } from '@/lib/data/mock-templates';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const store = TEMPLATES.find((item) => item.slug === params.slug);
  if (!store) return { title: 'قالب پیدا نشد' };
  return {
    title: store.title,
    description: `${store.description} - قیمت: ${store.basePrice.toLocaleString('fa-IR')} تومان`,
    alternates: { canonical: `/templates/${store.slug}` },
  };
}

export default function StoreDetailsPage({ params }: { params: { slug: string } }) {
  const store = TEMPLATES.find((item) => item.slug === params.slug);

  if (!store) notFound();

  return (
    <main className="store-detail-page">
      <section className="store-detail-hero">
        <div className="store-detail-copy">
          <span className="store-category">{store.categoryLabel}</span>
          <h1>{store.title}</h1>
          <p>{store.description}</p>
          <ul>
            {store.features.map((feature) => (
              <li key={feature}><Check aria-hidden="true" size={16} /> {feature}</li>
            ))}
          </ul>
          <div className="store-detail-price">
            {store.basePrice.toLocaleString('fa-IR')} <span>تومان، هزینه‌ی فروشگاه</span>
          </div>
          <Link className="button button-primary" href={`/templates/${store.slug}/customize`}>
            شخصی‌سازی و ثبت سفارش <ArrowLeft aria-hidden="true" size={16} />
          </Link>
          <p className="store-detail-disclaimer">
            این مبلغ برای نسخه‌ی فروشگاه است. دامنه و درگاه پرداخت پس از بررسی نیاز و دسترسی‌های شما هماهنگ می‌شود.
          </p>
        </div>
        <Image
          className="store-detail-image"
          src={store.thumbnailUrl}
          alt={`تصویر نمونه برای فروشگاه ${store.categoryLabel}`}
          width={1000}
          height={900}
          unoptimized
        />
      </section>

      <section className="store-delivery-section">
        <div className="section-heading">
          <div>
            <p className="catalog-kicker">انتخاب روش تحویل</p>
            <h2>دو مسیر روشن برای دریافت سایت</h2>
            <p>فعلاً ثبت این فرم، درخواست سفارش است؛ پرداخت آنلاین یا تحویل خودکار فعال نیست.</p>
          </div>
        </div>
        <div className="delivery-options">
          <article>
            <span className="delivery-option-label">برای تیم فنی</span>
            <h3>تحویل سورس‌کد</h3>
            <p>جزئیات فایل‌ها، مجوز استفاده، نیازهای فنی و دستورالعمل انتشار باید پیش از پرداخت برای همین محصول تأیید شود.</p>
            <ul><li>قیمت و در دسترس‌بودن نیازمند تأیید فروشنده است</li><li>دامنه، میزبانی و هزینه‌ی خدمات خارجی جداگانه‌اند</li></ul>
          </article>
          <article>
            <span className="delivery-option-label">راه‌اندازی با همراهی</span>
            <h3>نصب و پیکربندی</h3>
            <p>راه‌اندازی، محتوا و انتشار آنلاین فقط در محدوده‌ی خدمات توافق‌شده انجام می‌شود؛ زمان تحویل پس از بررسی نیازها مشخص خواهد شد.</p>
            <ul><li>دامنه و میزبانی در قیمت پایه لحاظ نشده‌اند</li><li>اطلاعات و دسترسی‌های لازم را مشتری فراهم می‌کند</li></ul>
          </article>
        </div>
      </section>

      <section className="store-preview-section">
        <div className="section-heading">
          <div>
            <h2>پیش‌نمایش ساختار فروشگاه</h2>
            <p className="store-preview-note">این پیش‌نمایش نمونه است و دمو زنده‌ی یک وب‌سایت منتشرشده نیست.</p>
          </div>
          <span className="preview-not-live">دموی زنده موجود نیست</span>
        </div>
        <StorefrontPreview config={store.defaultConfig} />
      </section>
    </main>
  );
}
