import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { unlink, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

// Point ORDERS_FILE to an isolated test file
const testFile = path.resolve(process.cwd(), `data/test-orders-${randomUUID()}.jsonl`);
process.env.ORDERS_FILE = testFile;

const { saveOrder, getOrders, findOrder, updateOrderStatus } = await import('../src/lib/data/orders-store.ts');

const sampleOrder = {
  id: randomUUID(),
  orderNumber: 'ORD-987654',
  templateId: 'aria-fashion',
  templateTitle: 'قالب فروشگاهی آریا',
  customerName: 'محمد رضایی',
  customerMobile: '09121112233',
  price: 2900000,
  deliveryMethod: 'managed_setup',
  config: {
    templateId: 'aria-fashion',
    theme: {
      primaryColor: '#0e7c5b',
      accentColor: '#101414',
      borderRadius: 'md',
    },
    brand: {
      storeName: 'فروشگاه تستی',
      tagline: 'تست سفارش',
      supportPhone: '09121112233',
    },
    featuredProducts: [],
  },
  status: 'pending_review',
  createdAt: new Date().toISOString(),
};

before(async () => {
  await mkdir(path.dirname(testFile), { recursive: true });
});

after(async () => {
  try {
    await unlink(testFile);
  } catch {
    // Ignore if not created
  }
});

test('getOrders returns empty array when file does not exist', async () => {
  const orders = await getOrders();
  assert.equal(orders.length, 0);
});

test('saveOrder persists an order and getOrders retrieves it', async () => {
  await saveOrder(sampleOrder);
  const orders = await getOrders();
  assert.equal(orders.length, 1);
  assert.equal(orders[0].orderNumber, 'ORD-987654');
  assert.equal(orders[0].customerMobile, '09121112233');
});

test('findOrder finds order by orderNumber and mobile (including casing & formatted mobile)', async () => {
  // Case-insensitive orderNumber
  const found = await findOrder('ord-987654', '09121112233');
  assert.ok(found);
  assert.equal(found.id, sampleOrder.id);

  // Formatted mobile number (+98, spaces, etc.)
  const foundFormatted = await findOrder('ORD-987654', '+98 912 111 2233');
  assert.ok(foundFormatted);
  assert.equal(foundFormatted.id, sampleOrder.id);
});

test('findOrder returns null if mobile does not match', async () => {
  const result = await findOrder('ORD-987654', '09990001122');
  assert.equal(result, null);
});

test('findOrder returns null if orderNumber does not exist', async () => {
  const result = await findOrder('ORD-000000', '09121112233');
  assert.equal(result, null);
});

test('updateOrderStatus updates status in memory and on disk', async () => {
  const updated = await updateOrderStatus(sampleOrder.id, 'building');
  assert.ok(updated);
  assert.equal(updated.status, 'building');

  const reloaded = await findOrder('ORD-987654', '09121112233');
  assert.ok(reloaded);
  assert.equal(reloaded.status, 'building');
});

test('updateOrderStatus returns null for unknown order ID', async () => {
  const unknown = await updateOrderStatus(randomUUID(), 'delivered');
  assert.equal(unknown, null);
});
