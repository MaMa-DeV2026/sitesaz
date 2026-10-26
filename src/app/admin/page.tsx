import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پنل مدیریت',
  robots: { index: false, follow: false },
};
import Link from 'next/link';
import { ArrowLeft, ClipboardList, Layers3 } from 'lucide-react';
import { getOrders } from '@/lib/data/orders-store';
import { TEMPLATES } from '@/lib/data/mock-templates';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let orders = [] as Awaited<ReturnType<typeof getOrders>>;
  let loadError = false;
  try {
    orders = await getOrders();
  } catch (error) {
    console.error('Unable to load admin dashboard metrics.', error);
    loadError = true;
  }

  const statusCounts = {
    pending_review: orders.filter((order) => order.status === 'pending_review').length,
    building: orders.filter((order) => order.status === 'building').length,
    delivered: orders.filter((order) => order.status === 'delivered').length,
  };

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p>ÙØ¶Ø§ÛŒ Ù…Ø¯ÛŒØ±ÛŒØª</p>
        <h1>Ù†Ù…Ø§ÛŒ Ú©Ù„ÛŒ Ø¹Ù…Ù„ÛŒØ§Øª</h1>
        <span>Ø¢Ù…Ø§Ø± Ø§Ø² Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ÛŒ Ø«Ø¨Øªâ€ŒØ´Ø¯Ù‡ Ùˆ ÙÙ‡Ø±Ø³Øª Ù…Ø­ØµÙˆÙ„Ø§Øª ÙØ¹Ù„ÛŒ Ø®ÙˆØ§Ù†Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯Ø› Ù¾Ø±Ø¯Ø§Ø®Øª Ø¢Ù†Ù„Ø§ÛŒÙ† Ùˆ Ù…Ø­Ø§Ø³Ø¨Ù‡â€ŒÛŒ Ø¯Ø±Ø¢Ù…Ø¯ Ø¯Ø± Ø³Ø§Ù…Ø§Ù†Ù‡ ÙØ¹Ø§Ù„ Ù†ÛŒØ³Øª.</span>
      </header>

      {loadError ? (
        <div className="admin-load-error" role="alert">Ø®ÙˆØ§Ù†Ø¯Ù† Ø¯Ø§Ø¯Ù‡â€ŒÙ‡Ø§ÛŒ Ø³ÙØ§Ø±Ø´ Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯. Ù…Ø³ÛŒØ± Ø°Ø®ÛŒØ±Ù‡â€ŒØ³Ø§Ø²ÛŒ Ùˆ Ø¯Ø³ØªØ±Ø³ÛŒ ÙØ§ÛŒÙ„ Ø±Ø§ Ø¨Ø±Ø±Ø³ÛŒ Ú©Ù†ÛŒØ¯.</div>
      ) : (
        <>
          <div className="admin-dashboard-grid" aria-label="Ø¢Ù…Ø§Ø± Ø¹Ù…Ù„ÛŒØ§ØªÛŒ">
            <article><span>Ú©Ù„ Ø¯Ø±Ø®ÙˆØ§Ø³Øªâ€ŒÙ‡Ø§</span><strong>{orders.length.toLocaleString('fa-IR')}</strong><small>Ù‡Ù…Ù‡â€ŒÛŒ ÙˆØ¶Ø¹ÛŒØªâ€ŒÙ‡Ø§</small></article>
            <article><span>Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø± Ø¨Ø±Ø±Ø³ÛŒ</span><strong>{statusCounts.pending_review.toLocaleString('fa-IR')}</strong><small>Ù†ÛŒØ§Ø²Ù…Ù†Ø¯ Ù¾ÛŒÚ¯ÛŒØ±ÛŒ</small></article>
            <article><span>Ø¯Ø± Ø­Ø§Ù„ Ø¢Ù…Ø§Ø¯Ù‡â€ŒØ³Ø§Ø²ÛŒ</span><strong>{statusCounts.building.toLocaleString('fa-IR')}</strong><small>Ø¬Ø±ÛŒØ§Ù† Ø¯Ø³ØªÛŒ ØªØ­ÙˆÛŒÙ„</small></article>
            <article><span>ØªØ­ÙˆÛŒÙ„â€ŒØ´Ø¯Ù‡</span><strong>{statusCounts.delivered.toLocaleString('fa-IR')}</strong><small>Ø¨Ø± Ø§Ø³Ø§Ø³ ÙˆØ¶Ø¹ÛŒØª Ø³ÙØ§Ø±Ø´</small></article>
            <article><span>Ù…Ø­ØµÙˆÙ„Ø§Øª Ú©Ø§ØªØ§Ù„ÙˆÚ¯</span><strong>{TEMPLATES.length.toLocaleString('fa-IR')}</strong><small>Ø§Ø² Ø¯Ø§Ø¯Ù‡â€ŒÛŒ Ø«Ø§Ø¨Øª Ø¨Ø±Ù†Ø§Ù…Ù‡Ø› ÙˆÛŒØ±Ø§ÛŒØ´ Ø§Ø² Ù¾Ù†Ù„ Ù…Ù…Ú©Ù† Ù†ÛŒØ³Øª</small></article>
          </div>
          <p className="admin-dashboard-notice">Ù¾Ø±Ø¯Ø§Ø®Øªâ€ŒÙ‡Ø§ÛŒ ØªØ£ÛŒÛŒØ¯Ø´Ø¯Ù‡ Ùˆ Ø¯Ø±Ø¢Ù…Ø¯ Ù†Ù…Ø§ÛŒØ´ Ø¯Ø§Ø¯Ù‡ Ù†Ù…ÛŒâ€ŒØ´ÙˆÙ†Ø¯ØŒ Ú†ÙˆÙ† Ø§ÛŒÙ† Ù¾Ø±ÙˆÚ˜Ù‡ Ù‡Ù†ÙˆØ² Ø¯Ø±Ú¯Ø§Ù‡ Ù¾Ø±Ø¯Ø§Ø®Øª ÛŒØ§ Ø«Ø¨Øª Ù…Ø§Ù„ÛŒ Ù†Ø¯Ø§Ø±Ø¯. Ù…Ø¨Ù„Øº Ø³ÙØ§Ø±Ø´ ÙØ¹Ù„ÛŒ ÙÙ‚Ø· Ù‚ÛŒÙ…Øª Ù¾Ø§ÛŒÙ‡â€ŒÛŒ Ø¯Ø±Ø®ÙˆØ§Ø³Øª Ø§Ø³Øª Ùˆ Ø±Ø³ÛŒØ¯ Ù¾Ø±Ø¯Ø§Ø®Øª Ù…Ø­Ø³ÙˆØ¨ Ù†Ù…ÛŒâ€ŒØ´ÙˆØ¯.</p>
          <div className="admin-dashboard-actions">
            <Link className="button button-primary" href="/admin/orders"><ClipboardList aria-hidden="true" size={17} /> Ù…Ø¯ÛŒØ±ÛŒØª Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ <ArrowLeft aria-hidden="true" size={15} /></Link>
            <Link className="button button-secondary" href="/templates"><Layers3 aria-hidden="true" size={17} /> Ù…Ø´Ø§Ù‡Ø¯Ù‡â€ŒÛŒ Ú©Ø§ØªØ§Ù„ÙˆÚ¯</Link>
          </div>
          <section className="admin-recent-orders">
            <div><h2>Ø¢Ø®Ø±ÛŒÙ† Ø¯Ø±Ø®ÙˆØ§Ø³Øªâ€ŒÙ‡Ø§</h2><Link href="/admin/orders">Ù‡Ù…Ù‡ Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ <ArrowLeft aria-hidden="true" size={15} /></Link></div>
            {orders.length ? (
              <ul>{orders.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, 5).map((order) => (
                <li key={order.id}><span><strong>{order.orderNumber}</strong><small>{order.customerName} Â· {order.templateTitle}</small></span><time dateTime={order.createdAt}>{new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(order.createdAt))}</time></li>
              ))}</ul>
            ) : <p>Ù‡Ù†ÙˆØ² Ø¯Ø±Ø®ÙˆØ§Ø³ØªÛŒ Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª.</p>}
          </section>
        </>
      )}
    </main>
  );
}

