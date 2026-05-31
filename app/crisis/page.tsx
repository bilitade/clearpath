import Link from "next/link";

export default function CrisisPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white mb-4">
        You deserve support right now
      </h1>
      <p className="text-lg leading-relaxed text-slate-200 mb-8">
        If you are thinking about hurting yourself or are in immediate danger,
        please reach out now. You are not alone, and help is available 24/7.
      </p>

      <ul className="space-y-4 list-none">
        <li className="rounded-xl border border-rose-800 bg-rose-950/80 p-5">
          <p className="text-sm text-slate-300 mb-1">988 Suicide & Crisis Lifeline</p>
          <a
            href="tel:988"
            className="text-2xl font-bold text-amber-200 hover:underline"
          >
            Call or text 988
          </a>
        </li>
        <li className="rounded-xl border border-rose-800 bg-rose-950/80 p-5">
          <p className="text-sm text-slate-300 mb-1">Crisis Text Line</p>
          <a
            href="sms:741741&body=HOME"
            className="text-2xl font-bold text-amber-200 hover:underline"
          >
            Text HOME to 741741
          </a>
        </li>
        <li className="rounded-xl border border-rose-800 bg-rose-950/80 p-5">
          <p className="text-sm text-slate-300 mb-1">Emergency services</p>
          <a
            href="tel:911"
            className="text-2xl font-bold text-amber-200 hover:underline"
          >
            Call 911
          </a>
        </li>
      </ul>

      <p className="mt-10 text-sm text-slate-200">
        These resources are always available. When you are ready, you can return to{" "}
        <Link href="/" className="text-amber-200 underline font-medium">
          ClearPath home
        </Link>{" "}
        or continue screening if you have not finished.
      </p>
    </main>
  );
}
