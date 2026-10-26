'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TEMPLATES } from '@/lib/data/mock-templates';

export function DeviceScrollShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsActive(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -55% 0px', threshold: 0.05 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`dw-scroll-showcase${isActive ? ' is-active' : ''}`}
      aria-labelledby="dw-scroll-showcase-title"
    >
      <div className="dw-scroll-sticky">
        <header className="dw-scroll-heading">
          <span><Sparkles aria-hidden="true" size={14} /> یک سایت، در همه‌ی اندازه‌ها</span>
          <h2 id="dw-scroll-showcase-title">از موبایل تا دسکتاپ، <em>همیشه خوش‌فرم</em></h2>
          <p>قالب‌ها را در نمای واقعی ببین؛ برای صفحه‌ای که مشتری دوست دارد با آن کار کند.</p>
        </header>

        <div className="dw-scroll-device-scene" aria-label="نمای قالب فروشگاهی در دسکتاپ و موبایل">
          <div className="dw-preview-window dw-scroll-desktop">
            <div className="dw-preview-toolbar" aria-hidden="true">
              <span /><span /><span />
              <div><Sparkles size={12} /> پیش‌نمایش فروشگاه</div>
            </div>
            <div className="dw-preview-site">
              <div className="dw-preview-sitebar"><strong>فروشگاه تو</strong><span>محصولات　 درباره ما　 تماس</span><i aria-hidden="true">سبد خرید</i></div>
              <div className="dw-preview-heading"><small>انتخاب‌های تازه</small><strong>محصولات محبوب<br />برای هر روز</strong><span>دیدن محصولات ←</span></div>
              <div className="dw-preview-products">
                {TEMPLATES.slice(0, 3).map((template, index) => (
                  <div className={`dw-preview-product product-${index + 1}`} key={template.id}>
                    <Image src={template.thumbnailUrl} alt={`نمونه قالب ${template.categoryLabel}`} width={420} height={270} unoptimized />
                    <span>{template.categoryLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dw-phone-preview dw-scroll-phone" aria-label="نمای موبایل قالب فروشگاهی">
            <div className="dw-phone-island" />
            <div className="dw-phone-top"><strong>آریا</strong><span>☰</span></div>
            <div className="dw-phone-image">
              <Image src={TEMPLATES[0].thumbnailUrl} alt="پیش‌نمایش فروشگاه در موبایل" width={360} height={250} unoptimized />
              <span>مجموعه‌ی تازه رسیده</span>
            </div>
            <div className="dw-phone-copy"><small>برای استایل هر روز</small><strong>انتخابی که<br />به تو می‌آید</strong><span>مشاهده‌ی مجموعه ←</span></div>
            <div className="dw-phone-dots"><i /><i /><i /></div>
          </div>

          <div className="dw-scroll-caption dw-scroll-caption-phone"><span>۰۱</span> نمای موبایل</div>
          <div className="dw-scroll-caption dw-scroll-caption-desktop"><span>۰۲</span> نمای دسکتاپ</div>
        </div>
      </div>
    </section>
  );
}
