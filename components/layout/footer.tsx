import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto shrink-0 border-t border-border py-4">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs leading-relaxed text-muted sm:px-6">
        Screening, not diagnosis.{" "}
        <Link href="/crisis" className="text-destructive hover:underline">
          Crisis help
        </Link>
        {" · "}© {year} ClearPath
      </div>
    </footer>
  );
}
