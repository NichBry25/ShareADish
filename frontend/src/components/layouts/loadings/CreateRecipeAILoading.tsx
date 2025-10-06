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

export default function CreateRecipeAILoading() {
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

      <section className="mx-auto w-full max-w-6xl px-6 py-3">
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <section className="flex min-h-[28rem] flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="space-y-4 animate-pulse">
              <SkeletonBlock className="h-6 w-48" />
              <SkeletonBlock className="h-40 w-full rounded-lg" />
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
            <div className="mt-6 flex justify-end animate-pulse">
              <SkeletonBlock className="h-10 w-32 rounded-lg" />
            </div>
          </section>

          <section className="flex min-h-[28rem] flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2 animate-pulse">
              <div>
                <SkeletonBlock className="h-6 w-36" />
                <div className="mt-4 space-y-2">
                  {[...Array(5).keys()].map((key) => (
                    <SkeletonBlock key={`ingredient-${key}`} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              <div>
                <SkeletonBlock className="h-6 w-28" />
                <div className="mt-4 space-y-2">
                  {[...Array(5).keys()].map((key) => (
                    <SkeletonBlock key={`nutrition-${key}`} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6 animate-pulse">
              <SkeletonBlock className="h-6 w-24" />
              <div className="mt-4 space-y-3">
                {[...Array(4).keys()].map((key) => (
                  <div key={`step-${key}`} className="flex gap-3">
                    <SkeletonCircle className="h-6 w-6" />
                    <SkeletonBlock className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <SkeletonBlock className="h-6 w-44" />
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
      </section>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 animate-pulse">
        <SkeletonBlock className="h-6 w-44 rounded-lg" />
        <SkeletonBlock className="h-10 w-28 rounded-lg" />
      </div>
    </main>
  );
}
