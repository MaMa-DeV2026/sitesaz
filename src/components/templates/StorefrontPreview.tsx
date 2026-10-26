import Image from 'next/image';
import type { StoreConfig } from '@/types';

export function StorefrontPreview({ config }: { config: StoreConfig }) {
  return (
    <section className="store-demo" aria-label={`دموی فروشگاه ${config.brand.storeName}`}>
      <header className="store-demo-header" style={{ borderColor: `${config.theme.primaryColor}30` }}>
        <strong style={{ color: config.theme.primaryColor }}>{config.brand.storeName}</strong>
        <span>محصولات　 درباره فروشگاه　 تماس</span>
      </header>
      <div className="store-demo-hero" style={{ backgroundColor: `${config.theme.accentColor}14` }}>
        <span>فروشگاه آنلاین</span>
        <h3 style={{ color: config.theme.primaryColor }}>{config.brand.storeName}</h3>
        <p>{config.brand.tagline}</p>
      </div>
      <div className="store-demo-products">
        <div className="store-demo-heading">
          <h4>محصولات منتخب</h4>
          <span>نمونه‌ی قابل ویرایش</span>
        </div>
        <div className="store-demo-grid">
          {config.featuredProducts.map((product) => (
            <article key={product.id} className="store-demo-product">
              <Image src={product.image} alt={product.title} width={520} height={380} unoptimized />
              <div>
                <small>{product.category}</small>
                <h5>{product.title}</h5>
                <strong style={{ color: config.theme.primaryColor }}>
                  {product.price.toLocaleString('fa-IR')} تومان
                </strong>
              </div>
            </article>
          ))}
        </div>
      </div>
      <footer className="store-demo-footer">
        راه تماس با فروشگاه: {config.brand.supportPhone}
      </footer>
    </section>
  );
}
