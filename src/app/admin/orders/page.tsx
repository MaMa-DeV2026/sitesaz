import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مدیریت سفارش‌ها',
  robots: { index: false, follow: false },
};
import { AdminOrdersTable } from '@/components/admin/AdminOrdersTable';
import { getOrders } from '@/lib/data/orders-store';
import type { Order } from '@/types';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  let orders: Order[] = [];
  let loadError = false;
  try {
    orders = await getOrders();
  } catch (error) {
    console.error('Unable to load admin orders.', error);
    orders = [];
    loadError = true;
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p>Ù…Ø¯ÛŒØ±ÛŒØª ÙØ±ÙˆØ´Ú¯Ø§Ù‡</p>
        <h1>Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ÛŒ ÙØ±ÙˆØ´Ú¯Ø§Ù‡ Ø¢Ù…Ø§Ø¯Ù‡</h1>
        <span>Ù…Ø´Ø®ØµØ§Øª Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ Ø±Ø§ Ø¨Ø±Ø±Ø³ÛŒ Ú©Ù†ÛŒØ¯ Ùˆ ÙˆØ¶Ø¹ÛŒØª Ø¢Ù…Ø§Ø¯Ù‡â€ŒØ³Ø§Ø²ÛŒ Ø±Ø§ Ø¨Ù‡â€ŒØ±ÙˆØ² Ù†Ú¯Ù‡ Ø¯Ø§Ø±ÛŒØ¯.</span>
      </header>
      {loadError ? (
        <div className="admin-load-error" role="alert">
          Ø®ÙˆØ§Ù†Ø¯Ù† Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ Ø§Ø² ÙØ¶Ø§ÛŒ Ø°Ø®ÛŒØ±Ù‡â€ŒØ³Ø§Ø²ÛŒ Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯. ØªÙ†Ø¸ÛŒÙ…Ø§Øª ÙØ§ÛŒÙ„ Ø¯Ø§Ø¯Ù‡ Ùˆ Ø¯Ø³ØªØ±Ø³ÛŒ Ù†ÙˆØ´ØªÙ† Ø±Ø§ Ø¨Ø±Ø±Ø³ÛŒ Ú©Ù†ÛŒØ¯.
        </div>
      ) : (
        <AdminOrdersTable initialOrders={orders} />
      )}
    </main>
  );
}

