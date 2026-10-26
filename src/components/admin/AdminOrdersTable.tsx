'use client';

import { useState } from 'react';
import type { Order } from '@/types';
import { OrderSchema } from '@/lib/schemas/store-config.schema';

const statusOptions: Array<{ value: Order['status']; label: string }> = [
  { value: 'pending_review', label: 'در انتظار بررسی' },
  { value: 'building', label: 'در حال آماده‌سازی' },
  { value: 'delivered', label: 'تحویل شده' },
];
const statusLabel = (status: Order['status']) =>
  statusOptions.find((option) => option.value === status)?.label ?? status;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(value));
}

export function AdminOrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [draftStatuses, setDraftStatuses] = useState<Record<string, Order['status']>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.orderNumber} ${order.customerName} ${order.templateTitle}`
      .toLocaleLowerCase('fa-IR')
      .includes(search.trim().toLocaleLowerCase('fa-IR'));
    return matchesSearch && (statusFilter === 'all' || order.status === statusFilter);
  });

  async function saveStatus(order: Order) {
    const status = draftStatuses[order.id] ?? order.status;
    if (status === order.status) return;

    setSavingId(order.id);
    setErrorMessage('');
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'به‌روزرسانی سفارش انجام نشد.');
      }
      const parsedOrder = OrderSchema.safeParse(data.order);
      if (!parsedOrder.success) throw new Error('پاسخ سرور برای سفارش معتبر نیست.');
      const updatedOrder = parsedOrder.data;
      setOrders((current) => current.map((item) => item.id === order.id ? updatedOrder : item));
      setDraftStatuses((current) => {
        const next = { ...current };
        delete next[order.id];
        return next;
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'به‌روزرسانی سفارش انجام نشد.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <div className="admin-order-summary" aria-label="خلاصه سفارش‌ها">
        <div><span>همه سفارش‌ها</span><strong>{orders.length.toLocaleString('fa-IR')}</strong></div>
        <div><span>در انتظار بررسی</span><strong>{orders.filter((order) => order.status === 'pending_review').length.toLocaleString('fa-IR')}</strong></div>
        <div><span>در حال آماده‌سازی</span><strong>{orders.filter((order) => order.status === 'building').length.toLocaleString('fa-IR')}</strong></div>
        <div><span>تحویل‌شده</span><strong>{orders.filter((order) => order.status === 'delivered').length.toLocaleString('fa-IR')}</strong></div>
      </div>

      <section className="admin-orders">
        <div className="admin-orders-toolbar">
          <h2>فهرست سفارش‌ها</h2>
          <div>
            <label>
              <span className="sr-only">جست‌وجوی سفارش‌ها</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="شماره، نام یا فروشگاه" />
            </label>
            <label>
              <span className="sr-only">فیلتر وضعیت سفارش</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">همه وضعیت‌ها</option>
                {statusOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {errorMessage && <p className="admin-error" role="alert">{errorMessage}</p>}

        {filteredOrders.length ? (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>شماره سفارش</th>
                  <th>نام فروشگاه</th>
                  <th>محصول</th>
                  <th>تاریخ ثبت</th>
                  <th>روش تحویل</th>
                  <th>هزینه</th>
                  <th>وضعیت آماده‌سازی</th>
                  <th>به‌روزرسانی</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}<small>{order.customerMobile}</small></td>
                    <td>{order.templateTitle}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.deliveryMethod === 'source_code' ? 'سورس‌کد' : 'نصب و راه‌اندازی'}</td>
                    <td>{order.price.toLocaleString('fa-IR')} تومان <small>قیمت درخواست، نه پرداخت تأییدشده</small></td>
                    <td>{statusLabel(order.status)}</td>
                    <td>
                      <div className="admin-status-action">
                        <select
                          aria-label={`وضعیت جدید سفارش ${order.orderNumber}`}
                          value={draftStatuses[order.id] ?? order.status}
                          onChange={(event) => {
                            const selected = statusOptions.find((option) => option.value === event.target.value);
                            if (selected) {
                              setDraftStatuses((current) => ({ ...current, [order.id]: selected.value }));
                            }
                          }}
                        >
                          {statusOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <button type="button" disabled={savingId === order.id || (draftStatuses[order.id] ?? order.status) === order.status} onClick={() => saveStatus(order)}>
                          {savingId === order.id ? 'در حال ذخیره' : 'ثبت'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty" role="status">
            <h3>{orders.length ? 'سفارشی با این مشخصات پیدا نشد' : 'هنوز سفارشی ثبت نشده است'}</h3>
            <p>{orders.length ? 'عبارت جست‌وجو یا فیلتر وضعیت را تغییر دهید.' : 'سفارش‌های ثبت‌شده در این فهرست نمایش داده می‌شوند.'}</p>
          </div>
        )}
      </section>
    </>
  );
}
