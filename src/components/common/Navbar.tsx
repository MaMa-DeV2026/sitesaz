'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardList, Menu, Search, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '/templates', label: 'قالب‌های آماده' },
  { href: '/pricing', label: 'هزینه‌ها' },
  { href: '/track', label: 'پیگیری سفارش' },
  { href: '/contact', label: 'تماس' },
];

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;

        // When user scrolls down more than 40px, mark as scrolled
        setIsScrolled(currentY > 40);

        // Hide when scrolling down past 120px; re-appear smoothly when scrolling up
        if (currentY > 120 && currentY > lastScrollY.current + 8 && !isMenuOpen) {
          setIsHidden(true);
        } else if (currentY < lastScrollY.current - 4 || currentY <= 40) {
          setIsHidden(false);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const headerClasses = [
    'site-header',
    isScrolled ? 'is-scrolled' : 'is-top',
    isHidden ? 'is-hidden' : '',
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <div className="site-header-inner">
        <Link className="site-brand" href="/" aria-label="خانه سایت‌ساز">
          <span className="site-brand-mark" aria-hidden="true">س</span>
          <span>
            <strong>سایت‌ساز</strong>
            <small>وب‌سایت اختصاصی با قیمت قالب</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="ناوبری اصلی">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <form
            className="dw-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const query = searchValue.trim();
              router.push(query ? `/templates?q=${encodeURIComponent(query)}` : '/templates');
            }}
          >
            <button type="submit" aria-label="جست‌وجو در قالب‌ها">
              <Search aria-hidden="true" size={16} />
            </button>
            <span className="sr-only">جست‌وجو</span>
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="جست‌وجوی دسته یا نام فروشگاه..."
              aria-label="جست‌وجو در قالب‌ها"
            />
          </form>
          <Link className="header-icon-link" href="/contact" aria-label="پشتیبانی و تماس"><UserRound aria-hidden="true" size={17} /></Link>
          <Link className="header-icon-link" href="/track" aria-label="پیگیری سفارش"><ClipboardList aria-hidden="true" size={17} /></Link>
          <Link className="header-cta" href="/contact">مشاوره رایگان</Link>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        </button>
      </div>
      <nav id="primary-navigation" className={`mobile-nav${isMenuOpen ? ' is-open' : ''}`} aria-label="ناوبری موبایل">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/contact" onClick={() => setIsMenuOpen(false)} style={{ color: '#0e7c5b', fontWeight: 800 }}>
          مشاوره رایگان
        </Link>
      </nav>
    </header>
  );
}


