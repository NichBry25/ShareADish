export default function SearchField() {
  return (
    <form className="flex w-full max-w-md items-center" role="search">
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
          placeholder="Search for dishes..."
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>
    </form>
  );
}