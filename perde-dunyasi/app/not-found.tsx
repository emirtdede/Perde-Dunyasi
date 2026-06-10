import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
      <div className="glass-card w-full max-w-xl rounded-[2rem] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Sayfa bulunamadı</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Aradığınız rota şu anda mevcut değil.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-foreground)]"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
