'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, CheckCircle2, Monitor, Palette, RotateCcw, RotateCw, ShieldCheck, Smartphone, Tablet } from 'lucide-react';
import { StoreConfigSchema } from '@/lib/schemas/store-config.schema';
import type { StoreConfig } from '@/types';

const predefinedPalettes = [
  { label: 'جنگلی', primary: '#1e4737', accent: '#a8c7a6' },
  { label: 'آبی کلاسیک', primary: '#213e63', accent: '#92b6d9' },
  { label: 'زرشکی', primary: '#632b3b', accent: '#d6a5aa' },
  { label: 'زیتونی', primary: '#45513a', accent: '#c3bd82' },
];

const currency = (value: number) => value.toLocaleString('fa-IR');
const phonePattern = /^0[0-9]{9,10}$/;

export function CustomizerWizard({
  initialConfig,
  templateTitle,
  templatePrice,
}: {
  initialConfig: StoreConfig;
  templateTitle: string;
  templatePrice: number;
}) {
  const [config, setConfig] = useState<StoreConfig>(initialConfig);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<'source_code' | 'managed_setup'>('managed_setup');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [draftSavedAt, setDraftSavedAt] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const previousConfig = useRef(initialConfig);
  const currentConfig = useRef(initialConfig);
  const draftKey = `sitesaz:customization:${initialConfig.templateId}`;

  useEffect(() => {
    if (currentConfig.current !== config) {
      previousConfig.current = currentConfig.current;
      currentConfig.current = config;
    }
  }, [config]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { savedAt?: string };
        if (parsed.savedAt) setDraftSavedAt(parsed.savedAt);
      }
    } catch {
      setDraftMessage('پیش‌نویس محلی قابل خواندن نیست.');
    }
  }, [draftKey]);

  const validation = useMemo(() => StoreConfigSchema.safeParse(config), [config]);
  const updateBrand = (field: keyof StoreConfig['brand'], value: string) => {
    setConfig((current) => ({
      ...current,
      brand: { ...current.brand, [field]: value },
    }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const continueToNextStep = () => {
    setErrorMessage('');
    if (step === 1) {
      const parsed = StoreConfigSchema.safeParse(config);
      const nextErrors: Record<string, string> = {};
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const fieldName = issue.path[issue.path.length - 1];
          if (typeof fieldName === 'string' && !nextErrors[fieldName]) {
            nextErrors[fieldName] = issue.message;
          }
        }
      }
      const phone = parsed.success ? parsed.data.brand.supportPhone : config.brand.supportPhone;
      if (!phonePattern.test(phone)) {
        nextErrors.supportPhone = 'شماره را با صفر و ۱۰ یا ۱۱ رقم وارد کنید.';
      }
      setFieldErrors(nextErrors);
      if (Object.values(nextErrors).some(Boolean)) return;
    }
    setStep((previous) => Math.min(3, previous + 1));
  };

  const submitOrder = async () => {
    setErrorMessage('');
    const parsed = StoreConfigSchema.safeParse(config);
    const nextErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const fieldName = issue.path[issue.path.length - 1];
        if (typeof fieldName === 'string' && !nextErrors[fieldName]) {
          nextErrors[fieldName] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setStep(1);
      return;
    }
    const phone = parsed.data.brand.supportPhone;
    if (!phonePattern.test(phone)) {
      setFieldErrors((current) => ({ ...current, supportPhone: 'شماره را با صفر و ۱۰ یا ۱۱ رقم وارد کنید.' }));
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: config.templateId,
          deliveryMethod,
          config: parsed.data,
          customerName: parsed.data.brand.storeName,
          customerMobile: phone,
        }),
      });

      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== 'object' || !('orderNumber' in data) || typeof data.orderNumber !== 'string') {
        const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
          ? data.error
          : 'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.';
        throw new Error(message);
      }
      setOrderNumber(data.orderNumber);
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="order-success">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2>درخواست سفارش ثبت شد</h2>
        <div className="order-number">
          <span>شماره پیگیری</span>
          <strong>{orderNumber}</strong>
        </div>
        <p>
          اطلاعات سفارش ذخیره شد. برای هماهنگی جزئیات آماده‌سازی و راه‌اندازی فروشگاه با شماره{' '}
          <strong>{config.brand.supportPhone}</strong> تماس گرفته می‌شود. ثبت این درخواست به‌معنای پرداخت یا انتشار خودکار نیست.
        </p>
        <div className="order-success-actions">
          <Link className="button button-primary" href={`/track?order=${encodeURIComponent(orderNumber)}`}>پیگیری این سفارش</Link>
          <Link className="button button-secondary" href="/templates">دیدن فروشگاه‌ها</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customizer-layout">
      <div className="customizer-form">
        <div className="customizer-progress" aria-label={`مرحله ${step} از ۳`}>
          {['اطلاعات برند', 'رنگ‌بندی', 'خلاصه سفارش'].map((label, index) => (
            <div className={step === index + 1 ? 'customizer-progress-item active' : 'customizer-progress-item'} key={label}>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="customizer-draft-tools">
          <button type="button" onClick={() => {
            try {
              const savedAt = new Date().toISOString();
              localStorage.setItem(draftKey, JSON.stringify({ config, savedAt }));
              setDraftSavedAt(savedAt);
              setDraftMessage('پیش‌نویس در همین مرورگر ذخیره شد.');
            } catch {
              setDraftMessage('ذخیره‌سازی مرورگر در دسترس نیست.');
            }
          }}>ذخیره پیش‌نویس</button>
          <button type="button" disabled={!draftSavedAt} onClick={() => {
            try {
              const saved = localStorage.getItem(draftKey);
              if (!saved) return;
              const parsed = StoreConfigSchema.safeParse((JSON.parse(saved) as { config?: unknown }).config);
              if (parsed.success) {
                setConfig(parsed.data);
                setDraftMessage('پیش‌نویس ذخیره‌شده بازیابی شد.');
              } else {
                setDraftMessage('ساختار پیش‌نویس معتبر نیست.');
              }
            } catch {
              setDraftMessage('بازیابی پیش‌نویس انجام نشد.');
            }
          }}>بازیابی</button>
          <button type="button" onClick={() => {
            setConfig(initialConfig);
            setDraftMessage('تنظیمات به نمونه اولیه بازگشت.');
          }}><RotateCcw aria-hidden="true" size={14} /> بازنشانی</button>
          <button type="button" disabled={currentConfig.current === initialConfig} onClick={() => {
            const lastConfig = previousConfig.current;
            setConfig(lastConfig);
            setDraftMessage('تغییر قبلی بازگردانی شد.');
          }}><RotateCw aria-hidden="true" size={14} /> بازگشت تغییر</button>
          <span className="draft-status" aria-live="polite">{draftMessage || (draftSavedAt ? `ذخیره قبلی: ${new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(draftSavedAt))}` : 'پیش‌نویس فقط در این مرورگر نگهداری می‌شود.')}</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3>
              <Building2 aria-hidden="true" size={17} /> اطلاعات برند
            </h3>

            <div>
              <label htmlFor="brand-name">نام فروشگاه شما</label>
              <input
                id="brand-name"
                aria-invalid={Boolean(fieldErrors.storeName)}
                aria-describedby={fieldErrors.storeName ? 'brand-name-error' : undefined}
                value={config.brand.storeName}
                onChange={(event) => updateBrand('storeName', event.target.value)}
              />
              {fieldErrors.storeName && <span id="brand-name-error" className="field-error">{fieldErrors.storeName}</span>}
            </div>

            <div>
              <label htmlFor="brand-tagline">توضیح کوتاه فروشگاه</label>
              <input
                id="brand-tagline"
                aria-invalid={Boolean(fieldErrors.tagline)}
                value={config.brand.tagline}
                onChange={(event) => updateBrand('tagline', event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="brand-phone">شماره همراه برای پیگیری سفارش</label>
              <input
                id="brand-phone"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={Boolean(fieldErrors.supportPhone)}
                aria-describedby={fieldErrors.supportPhone ? 'brand-phone-error' : 'brand-phone-help'}
                value={config.brand.supportPhone}
                onChange={(event) => updateBrand('supportPhone', event.target.value)}
              />
              <span id="brand-phone-help" className="field-help">برای هماهنگی جزئیات فروشگاه با شما تماس می‌گیریم.</span>
              {fieldErrors.supportPhone && <span id="brand-phone-error" className="field-error">{fieldErrors.supportPhone}</span>}
            </div>

            <div>
              <label htmlFor="brand-instagram">آیدی اینستاگرام (اختیاری)</label>
              <input
                id="brand-instagram"
                value={config.brand.instagramId || ''}
                onChange={(event) => updateBrand('instagramId', event.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3>
              <Palette aria-hidden="true" size={17} /> انتخاب رنگ فروشگاه
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {predefinedPalettes.map((palette) => (
                <button
                  key={palette.label}
                  type="button"
                  aria-pressed={config.theme.primaryColor === palette.primary && config.theme.accentColor === palette.accent}
                  onClick={() =>
                    setConfig({
                      ...config,
                      theme: { ...config.theme, primaryColor: palette.primary, accentColor: palette.accent },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-right transition hover:border-slate-400"
                >
                  <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: palette.primary }} />
                  <span className="-mr-2 h-4 w-4 rounded-full border" style={{ backgroundColor: palette.accent }} />
                  <span className="truncate text-[10px] font-bold text-slate-700">{palette.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor="primary-color">رنگ اصلی</label>
                <div className="flex items-center gap-2">
                  <input
                    id="primary-color"
                    type="color"
                    value={config.theme.primaryColor}
                    onChange={(event) => setConfig((current) => ({ ...current, theme: { ...current.theme, primaryColor: event.target.value } }))}
                    className="h-8 w-8 cursor-pointer rounded border"
                  />
                  <input
                    value={config.theme.primaryColor}
                    onChange={(event) => setConfig((current) => ({ ...current, theme: { ...current.theme, primaryColor: event.target.value } }))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[10px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="accent-color">رنگ مکمل</label>
                <div className="flex items-center gap-2">
                  <input
                    id="accent-color"
                    type="color"
                    value={config.theme.accentColor}
                    onChange={(event) => setConfig((current) => ({ ...current, theme: { ...current.theme, accentColor: event.target.value } }))}
                    className="h-8 w-8 cursor-pointer rounded border"
                  />
                  <input
                    value={config.theme.accentColor}
                    onChange={(event) => setConfig((current) => ({ ...current, theme: { ...current.theme, accentColor: event.target.value } }))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[10px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3>
              <CheckCircle2 aria-hidden="true" size={17} /> خلاصه سفارش
            </h3>

            <fieldset className="delivery-method-picker">
              <legend>روش تحویل موردنظر</legend>
              <label>
                <input type="radio" name="delivery-method" value="managed_setup" checked={deliveryMethod === 'managed_setup'} onChange={() => setDeliveryMethod('managed_setup')} />
                <span><strong>نصب و راه‌اندازی</strong><small>دامنه و میزبانی جداگانه‌اند؛ محدوده و زمان‌بندی پس از بررسی تأیید می‌شود.</small></span>
              </label>
              <label>
                <input type="radio" name="delivery-method" value="source_code" checked={deliveryMethod === 'source_code'} onChange={() => setDeliveryMethod('source_code')} />
                <span><strong>تحویل سورس‌کد</strong><small>محتویات بسته، مجوز، نیاز فنی و قیمت باید پیش از پرداخت تأیید شوند.</small></span>
              </label>
            </fieldset>

            <div className="customizer-summary">
              <div><span>فروشگاه انتخابی</span><strong>{templateTitle}</strong></div>
              <div><span>روش تحویل</span><strong>{deliveryMethod === 'source_code' ? 'سورس‌کد' : 'نصب و راه‌اندازی'}</strong></div>
              <div className="mb-2 flex items-center justify-between">
                <span>نام فروشگاه</span>
                <strong>{config.brand.storeName}</strong>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>شماره همراه</span>
                <strong>{config.brand.supportPhone}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>پالت رنگ</span>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: config.theme.primaryColor }} />
                  <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: config.theme.accentColor }} />
                </div>
              </div>
            </div>

            <div className="customizer-price">
              <div className="mb-2 flex items-center justify-between">
                <span>هزینه‌ی فروشگاه</span>
                <strong>{currency(templatePrice)} تومان</strong>
              </div>
              <p>این مرحله فقط درخواست سفارش است. پرداخت و انتشار آنلاین پس از هماهنگی انجام می‌شود.</p>
            </div>
          </div>
        )}

        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

        <div className="customizer-navigation">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            قبلی
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={continueToNextStep}
              className="button button-primary"
            >
              بعدی
            </button>
          ) : (
            <button
              type="button"
              onClick={submitOrder}
              disabled={isSubmitting || !validation.success}
              className="button button-primary"
            >
              {isSubmitting ? 'در حال ثبت درخواست...' : 'ثبت درخواست سفارش'}
            </button>
          )}
        </div>
      </div>

      <div className="customizer-preview">
        <div className="preview-toolbar" aria-label="اندازه پیش‌نمایش">
          <span>پیش‌نمایش زنده</span>
          {([
            { mode: 'desktop', label: 'رایانه', Icon: Monitor },
            { mode: 'tablet', label: 'تبلت', Icon: Tablet },
            { mode: 'mobile', label: 'موبایل', Icon: Smartphone },
          ] as const).map(({ mode, label, Icon }) => (
            <button key={mode} type="button" aria-pressed={previewMode === mode} onClick={() => setPreviewMode(mode)}>
              <Icon aria-hidden="true" size={15} /> {label}
            </button>
          ))}
        </div>
        <div
          dir="rtl"
          className={`customizer-store-preview preview-${previewMode}`}
          style={{ boxShadow: `0 30px 80px ${config.theme.primaryColor}1a` }}
        >
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4" style={{ backgroundColor: `${config.theme.primaryColor}10` }}>
            <div>
              <h2 className="text-base font-black tracking-tight" style={{ color: config.theme.primaryColor }}>
                {config.brand.storeName || 'نام فروشگاه شما'}
              </h2>
              <p className="text-[11px] text-slate-500">{config.brand.tagline}</p>
            </div>
            <button className="rounded-full px-3 py-1.5 text-[10px] font-bold text-white" style={{ backgroundColor: config.theme.primaryColor }}>
              سبد خرید (۰)
            </button>
          </header>

          <section className="px-6 py-7" style={{ background: `linear-gradient(135deg, ${config.theme.primaryColor}0d 0%, ${config.theme.accentColor}18 100%)` }}>
            <div className="mb-4 inline-block rounded-full px-2.5 py-1 text-[10px] font-black" style={{ color: config.theme.accentColor, backgroundColor: `${config.theme.accentColor}22` }}>
              فروشگاه رسمی و معتبر
            </div>
            <h3 className="text-2xl font-black text-slate-900">{config.brand.storeName}</h3>
            <p className="mt-1 text-xs text-slate-600">{config.brand.tagline}</p>
            <button className="mt-5 rounded-xl px-5 py-2 text-xs font-bold text-white" style={{ backgroundColor: config.theme.accentColor }}>
              مشاهده همه اجناس
            </button>
          </section>

          <div className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900">کالاهای برگزیده</h4>
              <span className="text-[10px] text-slate-400">پیش‌نمایش نمونه</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {config.featuredProducts.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="relative h-32 overflow-hidden bg-slate-100">
                    <Image src={item.image} alt={item.title} width={520} height={380} unoptimized className="h-full w-full object-cover" />
                    {item.badge && (
                      <span className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: config.theme.primaryColor }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 p-3">
                    <span className="text-[9px] font-semibold text-slate-400">{item.category}</span>
                    <h5 className="line-clamp-1 text-[11px] font-bold text-slate-800">{item.title}</h5>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black" style={{ color: config.theme.primaryColor }}>
                        {currency(item.price)} ت
                      </span>
                      <span className="rounded-md px-2.5 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: config.theme.primaryColor }}>
                      جزئیات
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="border-t border-slate-100 bg-slate-50 p-4 text-[11px] text-slate-500">
            <div className="flex items-center justify-between gap-2">
              <span>تماس: {config.brand.supportPhone}</span>
              <span>اینستاگرام: {config.brand.instagramId || 'ثبت نشده'}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
