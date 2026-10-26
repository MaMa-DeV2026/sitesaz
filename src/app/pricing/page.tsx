import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'هزینه‌ها و تعرفه‌ها',
  description: 'قیمت شفاف قالب‌های آماده فروشگاهی، هزینه‌های هاست و دامنه، و روش‌های تحویل فروشگاه آنلاین.',
  alternates: { canonical: '/pricing' },
};
import Link from 'next/link';
import { TEMPLATES } from '@/lib/data/mock-templates';

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <header className="pricing-heading">
        <p className="catalog-kicker">Ù‡Ø²ÛŒÙ†Ù‡â€ŒÛŒ Ø±ÙˆØ´Ù†</p>
        <h1>Ù‡Ø²ÛŒÙ†Ù‡ Ø¨Ø± Ø§Ø³Ø§Ø³ ÙØ±ÙˆØ´Ú¯Ø§Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ÛŒ</h1>
        <p>Ù‡Ø± ÙØ±ÙˆØ´Ú¯Ø§Ù‡ Ù‚ÛŒÙ…Øª Ù…Ø´Ø®Øµ Ø¯Ø§Ø±Ø¯. Ù…ÙˆØ§Ø±Ø¯ ÙˆØ§Ø¨Ø³ØªÙ‡ Ø¨Ù‡ Ø¯Ø§Ù…Ù†Ù‡ØŒ Ø¯Ø±Ú¯Ø§Ù‡ ÛŒØ§ Ø®Ø¯Ù…Ø§Øª Ø¬Ø§Ù†Ø¨ÛŒ Ù¾ÛŒØ´ Ø§Ø² Ø§Ø¬Ø±Ø§ Ø¬Ø¯Ø§Ú¯Ø§Ù†Ù‡ Ù‡Ù…Ø§Ù‡Ù†Ú¯ Ù…ÛŒâ€ŒØ´ÙˆÙ†Ø¯.</p>
      </header>

      <div className="pricing-list">
        {TEMPLATES.map((store) => (
          <article key={store.id}>
            <div>
              <span>{store.categoryLabel}</span>
              <h2>{store.title}</h2>
              <p>{store.description}</p>
            </div>
            <strong>{store.basePrice.toLocaleString('fa-IR')} <small>ØªÙˆÙ…Ø§Ù†</small></strong>
            <Link className="button button-primary" href={`/templates/${store.slug}`}>
              Ø¬Ø²Ø¦ÛŒØ§Øª ÙØ±ÙˆØ´Ú¯Ø§Ù‡
            </Link>
          </article>
        ))}
      </div>

      <aside className="pricing-note">
        <h2>Ú†Ù‡ Ù…ÙˆØ§Ø±Ø¯ÛŒ Ø¬Ø¯Ø§Ú¯Ø§Ù†Ù‡ Ù‡Ù…Ø§Ù‡Ù†Ú¯ Ù…ÛŒâ€ŒØ´ÙˆÙ†Ø¯ØŸ</h2>
        <p>Ø«Ø¨Øª Ø³ÙØ§Ø±Ø´ Ø´Ø§Ù…Ù„ Ù¾Ø±Ø¯Ø§Ø®Øª Ø¢Ù†Ù„Ø§ÛŒÙ† ÛŒØ§ Ø§Ù†ØªØ´Ø§Ø± Ø®ÙˆØ¯Ú©Ø§Ø± Ù†ÛŒØ³Øª. Ù‡Ø²ÛŒÙ†Ù‡â€ŒÛŒ Ø¯Ø§Ù…Ù†Ù‡ØŒ Ø¯Ø±Ú¯Ø§Ù‡ Ù¾Ø±Ø¯Ø§Ø®Øª Ùˆ Ù†ÛŒØ§Ø²Ù‡Ø§ÛŒ Ø§Ø®ØªØµØ§ØµÛŒ Ù¾Ø³ Ø§Ø² Ø¨Ø±Ø±Ø³ÛŒ Ùˆ ØªÙˆØ§ÙÙ‚ Ø¨Ø§ Ø´Ù…Ø§ Ù…Ø´Ø®Øµ Ù…ÛŒâ€ŒØ´ÙˆØ¯.</p>
        <Link className="text-link" href="/templates">Ø§Ù†ØªØ®Ø§Ø¨ ÙØ±ÙˆØ´Ú¯Ø§Ù‡ <span aria-hidden="true">â†</span></Link>
      </aside>
    </main>
  );
}

