import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { unlink, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const testFile = path.resolve(process.cwd(), `data/test-orders-track-${randomUUID()}.jsonl`);
process.env.ORDERS_FILE = testFile;

const { saveOrder } = await import('../src/lib/data/orders-store.ts');
const { GET } = await import('../src/app/api/orders/track/route.ts');

const sampleOrder = {
  id: randomUUID(),
  orderNumber: 'TRACK-123456',
  templateId: 'volt-digital',
  templateTitle: 'قالب فروشگاهی ولت',
  customerName: 'سارا احمدی',
  customerMobile: '09351234567',
  price: 3400000,
  deliveryMethod: 'source_code',
  config: {
    templateId: 'volt-digital',
    theme: {
      primaryColor: '#0e7c5b',
      accentColor: '#101414',
      borderRadius: 'lg',
    },
    brand: {
      storeName: 'دیجیتال سنتر',
      tagline: 'لوازم دیجیتال مدرن',
      supportPhone: '09351234567',
    },
    featuredProducts: [],
  },
  status: 'pending_review',
  createdAt: '2026-10-26T12:00:00.000Z',
};

before(async () => {
  await mkdir(path.dirname(testFile), { recursive: true });
  await saveOrder(sampleOrder);
});

after(async () => {
  try {
    await unlink(testFile);
  } catch {
    // Ignore
  }
});

test('GET /api/orders/track returns 400 for empty or missing parameters', async () => {
  const req = new Request('http://localhost:3000/api/orders/track');
  const res = await GET(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});

test('GET /api/orders/track returns 400 for invalid mobile format', async () => {
  const req = new Request('http://localhost:3000/api/orders/track?orderNumber=TRACK-123456&mobile=12345');
  const res = await GET(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});

test('GET /api/orders/track returns 404 for non-existent order number', async () => {
  const req = new Request('http://localhost:3000/api/orders/track?orderNumber=TRACK-999999&mobile=09351234567');
  const res = await GET(req);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.ok(data.error);
});

test('GET /api/orders/track returns 404 when mobile number does not match order', async () => {
  const req = new Request('http://localhost:3000/api/orders/track?orderNumber=TRACK-123456&mobile=09120000000');
  const res = await GET(req);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.ok(data.error);
});

test('GET /api/orders/track returns 200 with sanitized order details when found', async () => {
  const req = new Request('http://localhost:3000/api/orders/track?orderNumber=TRACK-123456&mobile=09351234567');
  const res = await GET(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.order);
  assert.equal(data.order.orderNumber, 'TRACK-123456');
  assert.equal(data.order.templateTitle, 'قالب فروشگاهی ولت');
  assert.equal(data.order.status, 'pending_review');
  assert.equal(data.order.deliveryMethod, 'source_code');
  assert.equal(data.order.price, 3400000);
  assert.equal(data.order.storeName, 'دیجیتال سنتر');
  // Confidential customer details must NOT be leaked
  assert.equal(data.order.customerMobile, undefined);
  assert.equal(data.order.customerName, undefined);
});
