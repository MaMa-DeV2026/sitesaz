import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateOrderStatus } from '@/lib/data/orders-store';

export const runtime = 'nodejs';

const StatusSchema = z.object({
  status: z.enum(['pending_review', 'building', 'delivered']),
}).strict();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'درخواست نامعتبر است.' }, { status: 400 });
  }

  const result = StatusSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'وضعیت سفارش معتبر نیست.' }, { status: 400 });
  }

  try {
    const order = await updateOrderStatus(params.id, result.data.status);
    if (!order) {
      return NextResponse.json({ error: 'سفارش پیدا نشد.' }, { status: 404 });
    }
    return NextResponse.json({ order }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to update order status.', error);
    return NextResponse.json({ error: 'ذخیره‌ی وضعیت سفارش انجام نشد.' }, { status: 500 });
  }
}
