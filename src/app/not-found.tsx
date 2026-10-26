import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="info-page not-found-page">
      <section className="not-found-content" aria-labelledby="not-found-title">
        <span className="not-found-code">۴۰۴</span>
        <p className="catalog-kicker">صفحه پیدا نشد</p>
        <h1 id="not-found-title">این آدرس به صفحه‌ای نمی‌رسد</h1>
        <p>ممکن است نشانی اشتباه باشد یا صفحه جابه‌جا شده باشد. از اینجا می‌توانید دوباره مسیرتان را پیدا کنید.</p>
        <div className="not-found-actions">
          <Link className="button button-primary" href="/">
            <Home aria-hidden="true" size={16} /> صفحهٔ اصلی
          </Link>
          <Link className="button button-secondary" href="/templates">
            دیدن قالب‌ها <ArrowLeft aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
