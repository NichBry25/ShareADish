"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeedRecipes, type WithSections, placeholder as placeholderImg } from "@/data/recipes";
import getImage from "@/lib/getRecipeImage";

type Props = {
  recipes?: WithSections[]; // optional override
};

export function RecipeFeedWidget({ recipes }: Props) {
  const list = recipes ?? getFeedRecipes();

  if (list.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Feed</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => {
          const author = r.created_by;
          return(
          <Link
            key={r.id}
            href={`/view-recipe/${encodeURIComponent(r.id)}`}
            className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:shadow"
          >
            <div className="relative h-40 w-full">
              <Image
                alt={r.title}
                src={getImage(r)}
                fill
                className="object-cover transition group-hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-1 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                        {author ?? "Unknown creator"}
              </p>
              <h3 className="line-clamp-1 font-medium text-zinc-900">{r.title}</h3>
              <p className="line-clamp-2 text-sm text-zinc-600">{r.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.tags.slice(0, 3).map((t) => (
                  <span
                    key={`${r.id}-${t}`}
                    className="rounded-full bg-zinc-900/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        )}
        )}
      </div>
    </section>
  );
}
