import { NextResponse } from 'next/server';
import { z } from 'zod';
import { findOrder } from '@/lib/data/orders-store';
import { normalizeIranianPhone } from '@/lib/phone';

export const runtime = 'nodejs';

const TrackQuerySchema = z.object({
  orderNumber: z.string().trim().min(6).max(40),
  mobile: z.string().transform(normalizeIranianPhone).pipe(z.string().regex(/^0[0-9]{9,10}$/, 'شماره همراه معتبر نیست.')),
});

const json = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = TrackQuerySchema.safeParse({
    orderNumber: url.searchParams.get('orderNumber') || '',
    mobile: url.searchParams.get('mobile') || '',
  });

  if (!parsed.success) {
    return json({ error: 'شماره سفارش و شماره همراه را بررسی کنید.' }, 400);
  }

  try {
    const order = await findOrder(parsed.data.orderNumber, parsed.data.mobile);
    if (!order) {
      return json(
        { error: 'سفارشی با این شماره سفارش و شماره همراه پیدا نشد. اطلاعات را دقیق وارد کنید.' },
        404
      );
    }

    return json({
      order: {
        orderNumber: order.orderNumber,
        templateTitle: order.templateTitle,
        status: order.status,
        deliveryMethod: order.deliveryMethod,
        createdAt: order.createdAt,
        price: order.price,
        storeName: order.config.brand.storeName,
      },
    }, 200);
  } catch (error) {
    console.error('Unable to look up order for tracking.', error);
    return json({ error: 'پیگیری سفارش در حال حاضر ممکن نیست. کمی بعد دوباره تلاش کنید.' }, 500);
  }
}
