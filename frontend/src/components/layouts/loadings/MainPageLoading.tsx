import { HeaderLayout } from "@/components/layouts/HeaderLayout";

type SkeletonProps = {
  className?: string;
};

function SkeletonBlock({ className = "" }: SkeletonProps) {
  return <div className={`rounded-md bg-neutral-200 ${className}`.trim()} />;
}

export default function LoadingForMainPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <HeaderLayout
        left={
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/30" />
            <div className="h-6 w-28 rounded-full bg-white/20" />
          </div>
        }
        center={
          <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white/10 px-4 py-2 animate-pulse">
            <div className="h-4 w-4 rounded-full bg-white/20" />
            <div className="h-4 flex-1 rounded-full bg-white/20" />
          </div>
        }
        right={
          <div className="flex justify-end gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/20" />
            <div className="h-10 w-10 rounded-full bg-white/20" />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <section className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-6 w-48" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6).keys()].map((key) => (
              <article
                key={`trending-${key}`}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100"
              >
                <SkeletonBlock className="aspect-[4/3] w-full" />
                <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                  <SkeletonBlock className="h-5 w-3/4" />
                  <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-4 w-16" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6).keys()].map((key) => (
              <article
                key={`seasonal-${key}`}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100"
              >
                <SkeletonBlock className="aspect-[4/3] w-full" />
                <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                  <SkeletonBlock className="h-5 w-3/4" />
                  <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-4 w-16" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-6 w-44" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
          <div className="mt-6 h-[550px] overflow-hidden rounded-2xl border border-zinc-100">
            <ul className="flex h-full flex-col overflow-hidden">
              {[...Array(5).keys()].map((key) => (
                <li key={`feed-${key}`} className="flex border-b border-zinc-100 bg-white/90 p-5 last:border-b-0">
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
                    <SkeletonBlock className="h-32 w-full rounded-2xl sm:h-32 sm:w-36 lg:h-36 lg:w-40" />
                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <SkeletonBlock className="h-3 w-24" />
                        <SkeletonBlock className="h-4 w-24" />
                      </div>
                      <SkeletonBlock className="h-5 w-3/4" />
                      <SkeletonBlock className="h-4 w-full" />
                      <SkeletonBlock className="h-4 w-48" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 animate-pulse">
        <SkeletonBlock className="h-12 w-32 rounded-full" />
      </div>
    </main>
  );
}
