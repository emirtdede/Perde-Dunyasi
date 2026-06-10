"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminLoginForm({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromPath, setFromPath] = useState<string>("/admin");

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    void searchParams.then((params) => {
      if (params.from) {
        setFromPath(params.from);
      }
    });
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Giriş başarısız");
      return;
    }

    router.replace(fromPath || "/admin");
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm outline-none ring-0 transition focus:border-[var(--accent)]"
          type="email"
          autoComplete="email"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium">Şifre</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm outline-none ring-0 transition focus:border-[var(--accent)]"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>

      <p className="text-xs text-[var(--muted)]">Geçiş hedefi: {fromPath}</p>
    </form>
  );
}
