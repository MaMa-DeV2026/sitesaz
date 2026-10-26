export type TemplateCategory = 'all' | 'fashion' | 'digital' | 'cosmetics' | 'food';

export interface TemplateMetadata {
  id: string;
  slug: string;
  title: string;
  category: TemplateCategory;
  categoryLabel: string;
  description: string;
  features: string[];
  thumbnailUrl: string;
  basePrice: number;
  defaultConfig: StoreConfig;
}

export interface StoreProductItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
}

export interface ThemeTokens {
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface BrandInfo {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  supportPhone: string;
  instagramId?: string;
  address?: string;
}

export interface StoreConfig {
  templateId: string;
  theme: ThemeTokens;
  brand: BrandInfo;
  featuredProducts: StoreProductItem[];
}

export type DeliveryMethod = 'source_code' | 'managed_setup';

export interface Order {
  id: string;
  orderNumber: string;
  templateId: string;
  templateTitle: string;
  customerName: string;
  customerMobile: string;
  price: number;
  deliveryMethod: DeliveryMethod;
  config: StoreConfig;
  status: 'pending_review' | 'building' | 'delivered';
  createdAt: string;
}
