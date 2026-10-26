'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { TEMPLATES } from '@/lib/data/mock-templates';

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('relevance');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCategory(params.get('category') || 'all');
      setSearch(params.get('q') || '');
      setSort(params.get('sort') || 'relevance');
      setMinPrice(params.get('min') || '');
      setMaxPrice(params.get('max') || '');
      setFiltersReady(true);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    if (!filtersReady) return;
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (search.trim()) params.set('q', search.trim());
    if (sort !== 'relevance') params.set('sort', sort);
    if (minPrice) params.set('min', minPrice);
    if (maxPrice) params.set('max', maxPrice);
    const query = params.toString();
    window.history.replaceState(null, '', query ? `/templates?${query}` : '/templates');
  }, [filtersReady, activeCategory, search, sort, minPrice, maxPrice]);

  const categories = useMemo(
    () => [
      { value: 'all', label: 'همه فروشگاه‌ها' },
      ...Array.from(new Map(TEMPLATES.map((template) => [template.category, template.categoryLabel])).entries()).map(
        ([value, label]) => ({ value, label })
      ),
    ],
    []
  );

  const stores = TEMPLATES.filter((template) => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const query = search.trim().toLocaleLowerCase('fa-IR');
    const matchesSearch =
      !query ||
      `${template.title} ${template.categoryLabel} ${template.description} ${template.features.join(' ')}`.toLocaleLowerCase('fa-IR').includes(query);
    const matchesMin = !minPrice || template.basePrice >= Number(minPrice);
    const matchesMax = !maxPrice || template.basePrice <= Number(maxPrice);
    return matchesCategory && matchesSearch && matchesMin && matchesMax;
  }).sort((left, right) => {
    if (sort === 'price-asc') return left.basePrice - right.basePrice;
    if (sort === 'price-desc') return right.basePrice - left.basePrice;
    if (sort === 'newest') return TEMPLATES.indexOf(right) - TEMPLATES.indexOf(left);
    return 0;
  });

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <div>
          <p className="catalog-kicker">فروشگاه‌های آماده</p>
          <h1>فروشگاهی برای شروع کسب‌وکار شما</h1>
          <p>دمو و امکانات هر فروشگاه را بررسی کنید. بعد، اطلاعات برند خود را برای نسخه اختصاصی ثبت کنید.</p>
        </div>
        <label className="catalog-search">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">جست‌وجو در فروشگاه‌ها</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="جست‌وجوی فروشگاه"
          />
        </label>
      </header>

      <div className="catalog-tools">
        <div className="catalog-filters" aria-label="دسته‌بندی فروشگاه‌ها">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={activeCategory === category.value ? 'catalog-filter active' : 'catalog-filter'}
              aria-pressed={activeCategory === category.value}
              onClick={() => setActiveCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="catalog-advanced-filters">
          <label>
            <span><SlidersHorizontal aria-hidden="true" size={14} /> مرتب‌سازی</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevance">پیشنهادی</option>
              <option value="newest">جدیدترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
            </select>
          </label>
          <label>
            <span>حداقل قیمت (تومان)</span>
            <input inputMode="numeric" type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="بدون محدودیت" />
          </label>
          <label>
            <span>حداکثر قیمت (تومان)</span>
            <input inputMode="numeric" type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="بدون محدودیت" />
          </label>
        </div>
      </div>

      <p className="catalog-result-count" aria-live="polite">{stores.length.toLocaleString('fa-IR')} فروشگاه</p>

      {stores.length ? (
        <div className="catalog-grid">
          {stores.map((store) => (
            <article className="catalog-card" key={store.id}>
              <Link href={`/templates/${store.slug}`} className="catalog-card-image">
                <Image
                  src={store.thumbnailUrl}
                  alt={`دموی فروشگاه ${store.categoryLabel}`}
                  width={900}
                  height={630}
                  unoptimized
                />
                <span>{store.categoryLabel}</span>
              </Link>
              <div className="catalog-card-content">
                <div>
                  <h2>{store.title}</h2>
                  <p>{store.description}</p>
                </div>
                <ul>
                  {store.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="catalog-card-bottom">
                  <div>
                    <small>هزینه‌ی این فروشگاه</small>
                    <strong>{store.basePrice.toLocaleString('fa-IR')} <span>تومان</span></strong>
                  </div>
                  <Link className="button button-primary" href={`/templates/${store.slug}`}>
                    دیدن جزئیات <ArrowLeft aria-hidden="true" size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <h2>فروشگاهی پیدا نشد</h2>
          <p>عبارت جست‌وجو را تغییر دهید یا دسته‌ی دیگری را انتخاب کنید.</p>
          <button type="button" className="button button-secondary" onClick={() => { setSearch(''); setActiveCategory('all'); setMinPrice(''); setMaxPrice(''); setSort('relevance'); }}>
            پاک کردن فیلترها
          </button>
        </div>
      )}
    </main>
  );
}
