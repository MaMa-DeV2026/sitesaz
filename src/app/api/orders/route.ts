import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { TEMPLATES } from '@/lib/data/mock-templates';
import { saveOrder } from '@/lib/data/orders-store';
import { normalizeIranianPhone } from '@/lib/phone';
import { StoreConfigSchema } from '@/lib/schemas/store-config.schema';

export const runtime = 'nodejs';

const OrderSubmissionSchema = z.object({
  templateId: z.string().min(1).max(80),
  deliveryMethod: z.enum(['source_code', 'managed_setup']).default('managed_setup'),
  config: StoreConfigSchema,
  customerName: z.string().trim().min(2).max(120),
  customerMobile: z.string().transform(normalizeIranianPhone)
    .pipe(z.string().regex(/^0[0-9]{9,10}$/, 'شماره همراه معتبر نیست.')),
}).strict();

const json = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 128 * 1024) {
    return json({ error: 'حجم اطلاعات سفارش بیش از حد مجاز است.' }, 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 128 * 1024) {
      return json({ error: 'حجم اطلاعات سفارش بیش از حد مجاز است.' }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: 'درخواست نامعتبر است.' }, 400);
  }

  const result = OrderSubmissionSchema.safeParse(body);
  if (!result.success) {
    return json({ error: 'اطلاعات سفارش را بررسی و دوباره ارسال کنید.', details: result.error.flatten() }, 400);
  }

  const template = TEMPLATES.find((item) => item.id === result.data.templateId);
  if (!template || result.data.config.templateId !== template.id) {
    return json({ error: 'فروشگاه انتخاب‌شده معتبر نیست.' }, 400);
  }

  const id = randomUUID();
  const order = {
    id,
    orderNumber: `SS-${Date.now().toString(36).toUpperCase()}-${id.slice(0, 6).toUpperCase()}`,
    templateId: template.id,
    templateTitle: template.title,
    customerName: result.data.customerName,
    customerMobile: result.data.customerMobile,
    price: template.basePrice,
    deliveryMethod: result.data.deliveryMethod,
    config: result.data.config,
    status: 'pending_review' as const,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveOrder(order);
  } catch (error) {
    console.error('Unable to persist store order.', error);
    return json({ error: 'ثبت سفارش در حال حاضر ممکن نیست. کمی بعد دوباره تلاش کنید.' }, 500);
  }

  return json({ orderNumber: order.orderNumber }, 201);
}
