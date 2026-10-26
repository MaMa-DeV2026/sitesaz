import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { normalizeIranianPhone } from '@/lib/phone';
import { OrderSchema } from '@/lib/schemas/store-config.schema';
import type { Order } from '@/types';

const ordersFile = () =>
  path.resolve(process.cwd(), process.env.ORDERS_FILE || 'data/orders.jsonl');

let writeQueue: Promise<void> = Promise.resolve();

async function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const previousWrite = writeQueue;
  let release: () => void = () => {};
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previousWrite;
  try {
    return await operation();
  } finally {
    release();
  }
}

export async function saveOrder(order: Order): Promise<void> {
  await withWriteLock(async () => {
    const file = ordersFile();
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, `${JSON.stringify(order)}\n`, { encoding: 'utf8', flag: 'a' });
  });
}

export async function getOrders(): Promise<Order[]> {
  try {
    const contents = await readFile(ordersFile(), 'utf8');
    return contents
      .split(/\r?\n/)
      .filter((line) => line.length > 0)
      .flatMap((line, index) => {
        try {
          return [OrderSchema.parse(JSON.parse(line))];
        } catch (error) {
          console.error(`Skipping invalid order record on line ${index + 1}.`, error);
          return [];
        }
      });
    
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function findOrder(
  orderNumber: string,
  customerMobile: string
): Promise<Order | null> {
  const orders = await getOrders();
  const normalizedMobile = normalizeIranianPhone(customerMobile);
  return (
    orders.find(
      (order) =>
        order.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() &&
        order.customerMobile === normalizedMobile
    ) ?? null
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order | null> {
  return withWriteLock(async () => {
    const orders = await getOrders();
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex < 0) return null;

    const updatedOrder = { ...orders[orderIndex], status };
    orders[orderIndex] = updatedOrder;
    const file = ordersFile();
    const temporaryFile = `${file}.${randomUUID()}.tmp`;
    await mkdir(path.dirname(file), { recursive: true });
    try {
      await writeFile(temporaryFile, `${orders.map((order) => JSON.stringify(order)).join('\n')}\n`, 'utf8');
      await rename(temporaryFile, file);
    } catch (error) {
      console.error('Unable to update persisted store order.', error);
      throw error;
    }
    return updatedOrder;
  });
}
