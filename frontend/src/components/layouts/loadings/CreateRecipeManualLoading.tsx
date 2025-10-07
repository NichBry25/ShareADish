import { HeaderLayout } from "@/components/layouts/HeaderLayout";

type SkeletonProps = {
  className?: string;
};

function SkeletonBlock({ className = "" }: SkeletonProps) {
  return <div className={`rounded-md bg-neutral-200 ${className}`.trim()} />;
}

function SkeletonCircle({ className = "" }: SkeletonProps) {
  return <div className={`rounded-full bg-neutral-200 ${className}`.trim()} />;
}

export default function CreateRecipeManualLoading() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      <HeaderLayout
        left={
          <div className="flex items-center gap-4 animate-pulse text-[#f9f5f0]">
            <div className="h-10 w-10 rounded-full bg-white/30" />
            <div className="h-6 w-32 rounded-full bg-white/20" />
          </div>
        }
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="animate-pulse space-y-3">
          <SkeletonBlock className="h-8 w-64" />
          <SkeletonBlock className="h-4 w-72" />
        </div>

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-4 w-2/3" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-10 w-full rounded-lg" />
              </div>
              <div className="lg:col-span-2 space-y-3">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-24 w-full rounded-lg" />
              </div>
              <div className="lg:col-span-2 space-y-3">
                <SkeletonBlock className="h-4 w-16" />
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-10 w-40 rounded-lg" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3).keys()].map((key) => (
                      <SkeletonBlock key={`tag-${key}`} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
                <SkeletonBlock className="h-3 w-28" />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <section className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonBlock className="h-6 w-32" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
              <SkeletonBlock className="h-4 w-3/4" />
              <div className="mt-4 space-y-3">
                {[...Array(3).keys()].map((key) => (
                  <div key={`ingredient-${key}`} className="flex items-center gap-3">
                    <SkeletonBlock className="h-10 flex-1 rounded-lg" />
                    <SkeletonBlock className="h-8 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6 animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonBlock className="h-6 w-36" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
              <SkeletonBlock className="h-4 w-3/4" />
              <div className="mt-4 space-y-3">
                {[...Array(3).keys()].map((key) => (
                  <div key={`nutrition-${key}`} className="grid gap-3 sm:grid-cols-[1.5fr_1fr_auto]">
                    <SkeletonBlock className="h-10 rounded-lg" />
                    <SkeletonBlock className="h-10 rounded-lg" />
                    <SkeletonBlock className="h-8 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonBlock className="h-6 w-24" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
              <SkeletonBlock className="h-4 w-3/4" />
              <div className="mt-4 space-y-4">
                {[...Array(3).keys()].map((key) => (
                  <div key={`step-${key}`} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <SkeletonCircle className="h-6 w-6" />
                      <SkeletonBlock className="h-24 flex-1 rounded-lg" />
                      <SkeletonBlock className="h-8 w-20 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 animate-pulse">
        <SkeletonBlock className="h-6 w-44 rounded-lg" />
        <SkeletonBlock className="h-10 w-32 rounded-lg" />
      </div>
    </main>
  );
}
