'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, Compass, MoveUpLeft, ShieldCheck, Smartphone, Sparkles, X, Zap } from 'lucide-react';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { DeviceScrollShowcase } from '@/components/common/DeviceScrollShowcase';
import { TEMPLATES } from '@/lib/data/mock-templates';

const steps = [
  { title: 'قالب مناسب کسب‌وکارت را پیدا کن', text: 'پیش‌نمایش و ویژگی‌های هر گزینه را ببین و با نیاز واقعی کسب‌وکارت تطبیق بده.' },
  { title: 'هویت برندت را تنظیم کن', text: 'نام، راه‌های تماس و رنگ‌ها را در پیش‌نمایش زنده امتحان کن.' },
  { title: 'روش تحویل را انتخاب کن', text: 'سورس‌کد یا راه‌اندازی با همراهی؛ محدوده، قیمت و زمان‌بندی پیش از نهایی‌سازی روشن می‌شود.' },
];

const STORE_TEMPLATES_PRICING = [
  { value: 'aria-fashion', label: 'قالب آریا (پوشاک و فشن)', base: 3850000 },
  { value: 'niloofar-beauty', label: 'قالب نیلوفر (زیبایی و پوست)', base: 3900000 },
  { value: 'volt-digital', label: 'قالب ولت (کالای دیجیتال)', base: 4300000 },
];

const ADDONS = [
  { value: 'sms', label: 'اتصال پنل پیامک خدماتی', price: 300000 },
  { value: 'seo', label: 'سئوی تکنیکال پیشرفته', price: 600000 },
  { value: 'lang', label: 'چندزبانه کامل (fa/en)', price: 800000 },
  { value: 'chat', label: 'سیستم چت آنلاین', price: 200000 },
];

const COMPARE_ROWS: { feature: string; custom: string; customGood: boolean; wp: string; wpGood: boolean }[] = [
  { feature: 'ساختار فنی و بهینه‌سازی', custom: 'کد کامپایل‌شده Next.js', customGood: true, wp: 'سنگین با افزونه‌های متعدد', wpGood: false },
  { feature: 'امنیت هسته', custom: 'معماری امن بدون دیتابیس عمومی', customGood: true, wp: 'نیازمند پچ مداوم افزونه‌ها', wpGood: false },
  { feature: 'تجربه کاربری موبایل', custom: 'طراحی واکنش‌گرا و سبک', customGood: true, wp: 'بسته به قالب متغیر', wpGood: false },
  { feature: 'سئوی ساختاریافته', custom: 'HTML تمیز و استاندارد', customGood: true, wp: 'نیازمند تنظیم افزونه سئو', wpGood: false },
  { feature: 'مالکیت و دسترسی سورس', custom: 'کد تمیز و قابل توسعه', customGood: true, wp: 'وابسته به اکوسیستم وردپرس', wpGood: false },
];

const fa = (n: number) => n.toLocaleString('fa-IR');

export default function HomePage() {
  const [pill, setPill] = useState('all');
  const pills = useMemo(
    () => [
      { value: 'all', label: 'همه' },
      ...Array.from(new Map(TEMPLATES.map((t) => [t.category, t.categoryLabel])).entries()).map(([value, label]) => ({ value, label })),
    ],
    []
  );

  const visible = useMemo(
    () => (pill === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === pill)),
    [pill]
  );

  const [selectedTemplate, setSelectedTemplate] = useState('aria-fashion');
  const [addons, setAddons] = useState<string[]>(['seo']);

  const toggleAddon = (v: string) =>
    setAddons((prev) => (prev.includes(v) ? prev.filter((a) => a !== v) : [...prev, v]));

  const total = useMemo(() => {
    const base = STORE_TEMPLATES_PRICING.find((i) => i.value === selectedTemplate)?.base ?? 3850000;
    const extra = ADDONS.filter((a) => addons.includes(a.value)).reduce((s, a) => s + a.price, 0);
    return base + extra;
  }, [selectedTemplate, addons]);

  return (
    <main className="landing">
      {/* Homepage hero */}
      <ScrollReveal as="section" className="dw-hero dw-hero-v2 dw-hero-copy-only" animation="fade-up" aria-labelledby="home-hero-title">
        <div className="dw-hero-copy">
          <span className="dw-badge"><Sparkles aria-hidden="true" size={14} /> انتخاب کن، شخصی‌سازی کن، آماده شو</span>
          <h1 id="home-hero-title">فروشگاه آنلاینِ کسب‌وکارت، <span>آماده‌ی شروع</span></h1>
          <p className="dw-sub">
            از میان قالب‌های حرفه‌ای انتخاب کن، پیش‌نمایش واقعی را ببین و رنگ و اطلاعات برندت را تنظیم کن.
            مسیر تحویل و هزینه از همان ابتدا روشن است.
          </p>
          <div className="dw-ctas">
            <Link className="button button-primary" href="/templates">
              دیدن قالب‌ها <ArrowLeft aria-hidden="true" size={16} />
            </Link>
            <Link className="button button-secondary" href="#how-it-works">
              روند کار چطور است؟
            </Link>
          </div>
          <div className="dw-hero-points" aria-label="مزیت‌های سایت‌ساز">
            <span><ShieldCheck aria-hidden="true" size={17} /> هزینه شفاف</span>
            <span><Smartphone aria-hidden="true" size={17} /> پیش‌نمایش موبایل</span>
            <span><Zap aria-hidden="true" size={16} /> کد اختصاصی و سریع</span>
          </div>
        </div>

        <div className="dw-hero-visual" aria-label="پیش‌نمایش قالب فروشگاهی">
          <div className="dw-preview-window">
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
          <div className="dw-phone-preview" aria-label="نمای موبایل قالب فروشگاهی">
            <div className="dw-phone-island" />
            <div className="dw-phone-top"><strong>آریا</strong><span>☰</span></div>
            <div className="dw-phone-image">
              <Image src={TEMPLATES[0].thumbnailUrl} alt="پیش‌نمایش فروشگاه در موبایل" width={360} height={250} unoptimized />
              <span>مجموعه‌ی تازه رسیده</span>
            </div>
            <div className="dw-phone-copy"><small>برای استایل هر روز</small><strong>انتخابی که<br />به تو می‌آید</strong><span>مشاهده‌ی مجموعه ←</span></div>
            <div className="dw-phone-dots"><i /><i /><i /></div>
          </div>
          <div className="dw-float-note dw-float-note-top"><span className="dw-live-dot" /> قالب آماده‌ی کسب‌وکار تو</div>
          <div className="dw-float-note dw-float-note-bottom"><span>✓</span> یک طراحی؛ در هر اندازه</div>
        </div>
      </ScrollReveal>

      <DeviceScrollShowcase />

      {/* Store types */}
      <section className="dw-store-types" aria-labelledby="dw-store-types-title">
        <div className="dw-store-types-heading">
          <p className="catalog-kicker">شروع از ایده‌ی فروشگاهت</p>
          <h2 id="dw-store-types-title">برای چه کسب‌وکاری سایت می‌سازی؟</h2>
          <p>یک نمونه را ببین و از همان‌جا قالب مناسب خودت را پیدا کن.</p>
        </div>
        <div className="dw-store-type-list">
          {TEMPLATES.map((template, index) => (
            <Link className="dw-store-type" href={`/templates/${template.slug}`} key={template.id}>
              <Image src={template.thumbnailUrl} alt={`نمونه فروشگاه ${template.categoryLabel}`} width={420} height={270} unoptimized />
              <span className="dw-store-type-copy">
                <small>۰{index + 1} / نمونه آماده</small>
                <strong>{template.categoryLabel}</strong>
              </span>
              <ArrowLeft aria-hidden="true" size={17} />
            </Link>
          ))}
        </div>
      </section>

      {/* Category pills + grid */}
      <ScrollReveal className="dw-pills" role="region" aria-label="دسته‌بندی نمونه‌ها" animation="fade-in">
        {pills.map((p) => (
          <button
            key={p.value}
            type="button"
            aria-pressed={pill === p.value}
            className={pill === p.value ? 'dw-pill active' : 'dw-pill'}
            onClick={() => setPill(p.value)}
          >
            {p.label}
          </button>
        ))}
      </ScrollReveal>

      <ScrollReveal className="dw-grid" animation="fade-up">
        {visible.map((store) => (
          <article className="dw-card" key={store.id}>
            <Link className="dw-card-img" href={`/templates/${store.slug}`} aria-label={`مشاهده ${store.title}`}>
              <Image src={store.thumbnailUrl} alt={`پیش‌نمایش ${store.title}`} width={800} height={500} unoptimized />
            </Link>
            <div className="dw-card-body">
              <span className="dw-card-cat">{store.categoryLabel}</span>
              <h3>{store.title}</h3>
              <p>{store.description}</p>
              <div className="dw-card-meta">
                <span className="dw-price"><small>شروع از</small><strong>{fa(store.basePrice)} تومان</strong></span>
                <Link className="dw-detail-btn" href={`/templates/${store.slug}`}>
                  جزئیات پکیج <MoveUpLeft aria-hidden="true" size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </ScrollReveal>

      {/* Calculator */}
      <ScrollReveal as="section" className="dw-calc" aria-labelledby="calc-title" animation="fade-up">
        <h2 id="calc-title">محاسبه‌گر آنلاین قیمت</h2>
        <p className="dw-calc-sub">قالب فروشگاهی و امکانات را انتخاب کن؛ جمع کل شفاف نمایش داده می‌شود.</p>
        <div className="dw-calc-grid">
          <div>
            <fieldset>
              <legend>انتخاب قالب فروشگاهی:</legend>
              <div className="dw-radio-row">
                {STORE_TEMPLATES_PRICING.map((tmpl) => (
                  <label key={tmpl.value} className={selectedTemplate === tmpl.value ? 'dw-radio on' : 'dw-radio'}>
                    <input
                      type="radio"
                      name="storeTemplate"
                      checked={selectedTemplate === tmpl.value}
                      onChange={() => setSelectedTemplate(tmpl.value)}
                    />
                    {tmpl.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset style={{ marginTop: 18 }}>
              <legend>امکانات افزوده:</legend>
              <div className="dw-addons">
                {ADDONS.map((a) => {
                  const on = addons.includes(a.value);
                  return (
                    <div className="dw-addon" key={a.value}>
                      <span>{a.label} <small>+{fa(a.price)} تومان</small></span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={a.label}
                        className="dw-switch"
                        onClick={() => toggleAddon(a.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="dw-total" aria-live="polite">
            <span>آماده‌سازی سریع پس از ثبت اطلاعات</span>
            <strong>جمع کل: {fa(total)} تومان</strong>
            <Link className="button button-primary" href="/templates">
              سفارش این پکیج با این امکانات
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Compare */}
      <ScrollReveal as="section" className="dw-compare" id="compare" aria-labelledby="compare-title" animation="fade-up">
        <h2 id="compare-title">جدول مقایسه سرشاخ</h2>
        <p className="dw-compare-sub">کد اختصاصی Next.js در برابر وردپرس سنتی</p>
        <div className="dw-cmp-wrap">
          <div className="dw-cmp-head" aria-hidden="true">
            <div>ویژگی</div>
            <div className="hl">پکیج کد اختصاصی (Next.js)</div>
            <div>وردپرس سنتی</div>
          </div>
          {COMPARE_ROWS.map((r) => (
            <div className="dw-cmp-row" key={r.feature}>
              <div>{r.feature}</div>
              <div className="good">{r.customGood ? <Check aria-hidden="true" size={15} /> : <X aria-hidden="true" size={15} />} {r.custom}</div>
              <div className="bad">{r.wpGood ? <Check aria-hidden="true" size={15} /> : <X aria-hidden="true" size={15} />} {r.wp}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* How it works */}
      <ScrollReveal as="section" className="how-section" id="how-it-works" animation="fade-up">
        <div className="how-copy">
          <p className="catalog-kicker">ساده و قدم‌به‌قدم</p>
          <h2>از انتخاب تا تحویل، با تصمیم‌های روشن</h2>
          <p>هر قدم را با اطلاعات قابل بررسی طی کن؛ ثبت درخواست به‌معنای پرداخت یا انتشار خودکار نیست.</p>
          <Link className="text-link" href="/templates">
            شروع با انتخاب فروشگاه <ArrowLeft aria-hidden="true" size={16} />
          </Link>
        </div>

        <ol className="steps-list">
          {steps.map((step) => (
            <li key={step.title}>
              <span className="step-mark" aria-hidden="true"><Compass size={16} /></span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </ScrollReveal>

      {/* Clarity section */}
      <ScrollReveal as="section" className="clarity-section" animation="fade-up">
        <div>
          <p className="catalog-kicker">بدون هزینه‌ی ناگفته</p>
          <h2>روشن و قابل اعتماد، از ابتدا</h2>
          <p>
            هزینه‌ی سایت بر اساس فروشگاه انتخابی مشخص است. پرداخت، دامنه و انتشار آنلاین فقط پس از
            هماهنگی و پیکربندی واقعی انجام می‌شوند.
          </p>
        </div>
        <Link className="button button-secondary" href="/pricing">
          جزئیات هزینه‌ها <ArrowLeft aria-hidden="true" size={16} />
        </Link>
      </ScrollReveal>

      {/* FAQ section */}
      <ScrollReveal as="section" className="faq-section" animation="fade-up">
        <p className="catalog-kicker">پاسخ‌های روشن</p>
        <h2>پرسش‌های پرتکرار</h2>
        <details>
          <summary>بعد از سفارش چه چیزی تحویل می‌گیرم؟ <ChevronDown aria-hidden="true" size={18} /></summary>
          <p>پس از ثبت درخواست، اطلاعات انتخابی بررسی و جزئیات محدوده و روش تحویل با شما هماهنگ می‌شود. ثبت درخواست به‌معنای پرداخت نیست.</p>
        </details>
        <details>
          <summary>آیا سایت بعد از خرید آماده‌ی فروش است؟ <ChevronDown aria-hidden="true" size={18} /></summary>
          <p>فروشگاه بر پایه‌ی یک محصول توسعه‌یافته آماده می‌شود. اتصال دامنه و درگاه پرداخت به اطلاعات و دسترسی‌های واقعی شما نیاز دارد.</p>
        </details>
        <details>
          <summary>چرا کد اختصاصی به‌جای وردپرس؟ <ChevronDown aria-hidden="true" size={18} /></summary>
          <p>سرعت بارگذاری بهینه، امنیت بالاتر هسته و تجربه موبایل روان؛ بدون وابستگی به افزونه‌های سنگین.</p>
        </details>
      </ScrollReveal>

      {/* Closing CTA */}
      <ScrollReveal as="section" className="closing-cta" animation="fade-up">
        <div>
          <h2>فروشگاه مناسب را پیدا کن.</h2>
          <p>دموها را ببین و بعد با اطلاعات کسب‌وکارت سفارش را ثبت کن.</p>
        </div>
        <Link className="button button-primary" href="/templates">
          دیدن فروشگاه‌ها <ArrowLeft aria-hidden="true" size={17} />
        </Link>
      </ScrollReveal>
    </main>
  );
}
