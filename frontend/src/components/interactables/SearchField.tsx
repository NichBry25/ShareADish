"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TAG_OPTIONS = [
  "Summer",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Quick",
  "Vegan",
  "Vegetarian",
  "Protein-Heavy",
  "Dessert",
  "Healthy",
];

export default function SearchField() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set('id',trimmed)
    if (tag) params.set('tag',tag)
    router.push(`/search/by${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTag(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-2"
      role="search"
    >
      {/* Search input (title / free-text) */}
      <label htmlFor="site-search" className="sr-only">
        Search for dishes
      </label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
          <svg
            aria-hidden="true"
            focusable="false"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </div>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title…"
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      {/* Tag dropdown */}
      <div className="relative">
        <label htmlFor="tag-filter" className="sr-only">
          Filter by tag
        </label>
        <select
          id="tag-filter"
          value={tag}
          onChange={handleTagChange}
          className="w-40 appearance-none rounded-full border border-zinc-200 bg-white py-2 pl-3 pr-9 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="">Tag filter…</option>
          {TAG_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {/* custom arrow with comfortable right padding */}
        <svg
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Submit button (for keyboard/UX consistency) */}
      <button
        type="submit"
        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        Search
      </button>
    </form>
  );
}
