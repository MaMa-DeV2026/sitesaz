'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ClipboardList, Loader2, Search } from 'lucide-react';

type TrackStatus = 'pending_review' | 'building' | 'delivered';

interface TrackResult {
  orderNumber: string;
  templateTitle: string;
  status: TrackStatus;
  deliveryMethod: 'source_code' | 'managed_setup';
  createdAt: string;
  price: number;
  storeName: string;
}

const STATUS_LABELS: Record<TrackStatus, string> = {
  pending_review: 'در انتظار بررسی',
  building: 'در حال آماده‌سازی',
  delivered: 'تحویل شده',
};

const STEPS: Array<{ key: TrackStatus; title: string; text: string }> = [
  { key: 'pending_review', title: 'در انتظار بررسی', text: 'درخواست شما ثبت شده و در صف بررسی اولیه است.' },
  { key: 'building', title: 'در حال آماده‌سازی', text: 'جزئیات فروشگاه در حال آماده‌سازی و پیکربندی است.' },
  { key: 'delivered', title: 'تحویل شده', text: 'فروشگاه آماده و فرایند تحویل تکمیل شده است.' },
];

const statusIndex = (status: TrackStatus) => STEPS.findIndex((step) => step.key === status);

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('order');
    if (preset) setOrderNumber(preset);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!orderNumber.trim() || !mobile.trim()) {
      setError('شماره سفارش و شماره همراه را وارد کنید.');
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim(), mobile: mobile.trim() });
      const response = await fetch(`/api/orders/track?${params.toString()}`, { cache: 'no-store' });
      const data: unknown = await response.json();

      if (!response.ok || !data || typeof data !== 'object' || !('order' in data)) {
        const message =
          data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
            ? data.error
            : 'پیگیری سفارش انجام نشد. دوباره تلاش کنید.';
        setError(message);
        return;
      }

      setResult(data.order as TrackResult);
    } catch {
      setError('ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  }

  const activeIndex = result ? statusIndex(result.status) : -1;

  return (
    <main className="track-page">
      <header className="track-header">
        <p className="catalog-kicker">پیگیری سفارش</p>
        <h1>وضعیت سفارش خود را ببینید</h1>
        <p>
          شماره سفارشی که پس از ثبت درخواست دریافت کردید و شماره همراهی که هنگام سفارش وارد کردید را
          وارد کنید.
        </p>
      </header>

      <form className="track-form" onSubmit={submit} noValidate>
        <div className="track-fields">
          <div>
            <label htmlFor="track-order-number">شماره سفارش</label>
            <input
              id="track-order-number"
              dir="ltr"
              placeholder="SS-XXXXXXX-XXXXXX"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="track-mobile">شماره همراه ثبت‌شده</label>
            <input
              id="track-mobile"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09xxxxxxxxx"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="button button-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" size={16} /> در حال جست‌وجو...
            </>
          ) : (
            <>
              <Search aria-hidden="true" size={16} /> پیگیری سفارش
            </>
          )}
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="track-result" aria-live="polite">
          <div className="track-result-head">
            <div>
              <span className="track-result-number">{result.orderNumber}</span>
              <h2>{result.storeName}</h2>
              <p>
                {result.templateTitle} · {result.deliveryMethod === 'source_code' ? 'تحویل سورس‌کد' : 'نصب و راه‌اندازی'}
              </p>
            </div>
            <span className={`track-status track-status-${result.status}`}>
              {STATUS_LABELS[result.status]}
            </span>
          </div>

          <ol className="track-steps">
            {STEPS.map((step, index) => (
              <li
                key={step.key}
                className={
                  index < activeIndex ? 'track-step done' : index === activeIndex ? 'track-step current' : 'track-step'
                }
              >
                <span className="track-step-mark" aria-hidden="true">
                  {index < activeIndex ? <Check size={14} /> : index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="track-result-meta">
            <div>
              <span>تاریخ ثبت درخواست</span>
              <strong>
                {new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date(result.createdAt))}
              </strong>
            </div>
            <div>
              <span>هزینه اعلام‌شده فروشگاه</span>
              <strong>
                {result.price.toLocaleString('fa-IR')} تومان
                <small> قیمت درخواست؛ پرداخت جداگانه هماهنگ می‌شود.</small>
              </strong>
            </div>
          </div>

          <p className="track-result-note">
            برای تغییر در جزئیات سفارش یا هماهنگی راه‌اندازی، از صفحه تماس پیگیری کنید.
          </p>
        </section>
      )}

      {!result && (
        <div className="track-empty" role="status">
          <ClipboardList aria-hidden="true" size={22} />
          <p>شماره سفارش در پیامک یا صفحه «ثبت سفارش موفق» نمایش داده شده است.</p>
          <Link className="text-link" href="/templates">
            رفتن به فروشگاه‌ها <ArrowLeft aria-hidden="true" size={15} />
          </Link>
        </div>
      )}
    </main>
  );
}
