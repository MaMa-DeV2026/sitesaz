import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Link href="/">سایت‌ساز</Link>
          <p>سایت حرفه‌ای کسب‌وکارت، با هزینه‌ی کمتر و انتخابی آگاهانه.</p>
        </div>
        <nav aria-label="پیوندهای پایانی">
          <Link href="/templates">فروشگاه‌ها</Link>
          <Link href="/pricing">هزینه‌ها</Link>
          <Link href="/track">پیگیری سفارش</Link>
          <Link href="/about">درباره ما</Link>
          <Link href="/contact">تماس و پشتیبانی</Link>
        </nav>
        <p className="footer-note">هزینه‌ی دامنه و میزبانی جداست. پرداخت و راه‌اندازی فقط پس از توافق و پیکربندی واقعی انجام می‌شود.</p>
      </div>
      <div className="footer-bottom">© ۱۴۰۵ سایت‌ساز</div>
    </footer>
  );
}
