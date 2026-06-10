type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="glass-card rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 animate-fade-in-up">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)] animate-fade-in-up">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl animate-fade-in-up delay-100">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg animate-fade-in-up delay-200">
        {description}
      </p>
    </section>
  );
}
