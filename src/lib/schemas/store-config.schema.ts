import { z } from 'zod';
import { normalizeIranianPhone } from '@/lib/phone';

const stringOrNumber = () =>
  z.union([z.string(), z.number()]).transform((value) => String(value));

export const ThemeTokensSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'کد رنگ نامعتبر است'),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'کد رنگ نامعتبر است'),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']).default('md'),
});

export const BrandInfoSchema = z.object({
  storeName: z.string().trim().min(2, 'نام فروشگاه باید حداقل ۲ حرف باشد').max(100),
  tagline: z.string().trim().max(100, 'شعار نباید بیش از ۱۰۰ کاراکتر باشد'),
  logoUrl: z.string().max(2048).regex(/^(https?:\/|\/(?!\/))/, 'نشانی لوگو معتبر نیست').optional(),
  supportPhone: z.string()
    .transform(normalizeIranianPhone)
    .pipe(z.string().regex(/^0[0-9]{9,10}$/, 'شماره تماس باید ۱۰ یا ۱۱ رقمی با ۰ شروع شود')),
  instagramId: z.string().trim().max(50).optional(),
  address: z.string().trim().max(240).optional(),
});

export const StoreProductItemSchema = z.object({
  id: stringOrNumber(),
  title: z.string().trim().min(1).max(120),
  price: z.number().finite().nonnegative(),
  category: z.string().trim().max(80),
  image: z.string().max(2048).regex(/^(https?:\/|\/(?!\/))/, 'نشانی تصویر معتبر نیست'),
  badge: z.string().trim().max(40).optional(),
});

export const StoreConfigSchema = z.object({
  templateId: z.string().min(1).max(80),
  theme: ThemeTokensSchema,
  brand: BrandInfoSchema,
  featuredProducts: z.array(StoreProductItemSchema).max(40),
});

export type StoreConfig = z.infer<typeof StoreConfigSchema>;

export const OrderSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string().min(1).max(40),
  templateId: z.string().min(1).max(80),
  templateTitle: z.string().min(1).max(120),
  customerName: z.string().min(2).max(120),
  customerMobile: z.string().regex(/^0[0-9]{9,10}$/),
  price: z.number().int().positive(),
  deliveryMethod: z.enum(['source_code', 'managed_setup']).default('managed_setup'),
  config: StoreConfigSchema,
  status: z.enum(['pending_review', 'building', 'delivered']),
  createdAt: z.string().datetime(),
});
