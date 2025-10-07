import Link from "next/link";

export default function AccountButton() {
  return (
    <Link href='/your-account'>
        <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-transparent bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-200 hover:bg-zinc-100"
        aria-label="Account menu"
        >
        <svg
            aria-hidden="true"
            focusable="false"
            className="h-6 w-6 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" />
        </svg>
        <span className="hidden text-sm font-semibold text-zinc-700 sm:inline">
            Account
        </span>
        </button>
    </Link>
  );
}