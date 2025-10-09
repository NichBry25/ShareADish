export default function RecipeDetailLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-40 rounded-full bg-zinc-200" />
      <div className="h-72 w-full rounded-3xl bg-zinc-200" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 rounded bg-zinc-200" />
        <div className="h-4 w-1/2 rounded bg-zinc-200" />
        <div className="flex gap-3">
          <div className="h-6 w-20 rounded-full bg-zinc-200" />
          <div className="h-6 w-20 rounded-full bg-zinc-200" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-zinc-100 bg-white/70 p-5">
          <div className="h-5 w-1/3 rounded bg-zinc-200" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 w-full rounded bg-zinc-200" />
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-zinc-100 bg-white/70 p-5">
          <div className="h-5 w-1/3 rounded bg-zinc-200" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 w-full rounded bg-zinc-200" />
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-2xl border border-zinc-100 bg-white/70 p-5">
        <div className="h-5 w-1/3 rounded bg-zinc-200" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-4 w-full rounded bg-zinc-200" />
        ))}
      </div>
    </div>
  );
}
