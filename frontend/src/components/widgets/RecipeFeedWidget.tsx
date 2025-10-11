"use client";

import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/widgets/StarRating";
import { getFeedRecipes } from "@/data/recipes";
import { placeholder } from "@/data/recipes";
import getImage from "@/lib/getRecipeImage";



export function RecipeFeedWidget() {
  
  const feed = getFeedRecipes()

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Spotlight Feed</h2>
      </header>
      <div className="mt-6 h-[550px] overflow-hidden rounded-2xl border border-zinc-100">
        <ul className="flex h-full snap-y snap-mandatory flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {feed.map((item) => {
            const author = item.created_by;
            return (
            <li
              key={item.id}
              className="flex border-b border-zinc-100 bg-white/90 p-5 last:border-b-0 snap-start"
            >
              <Link
                href={`/view-recipe/${item.id}`}
                className="flex w-full flex-col gap-4 sm:flex-row sm:items-start"
              >
                <div className="relative h-36 w-full overflow-hidden rounded-2xl sm:h-32 sm:w-36 lg:h-36 lg:w-40">
                  <Image
                    src={getImage(item)} 
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 144px, 88vw"
                    className="object-cover transition hover:scale-[1.02]"
                    priority={false}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                        {author ?? "Unknown creator"}
                      </p>
                      <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                    </div>
                    <StarRating value={item.rating ?? 0} />
                  </div>
                  <span className="text-xs font-medium text-zinc-500">
                    {(item.no_rated ?? 0).toLocaleString()} people rated this
                  </span>
                </div>
              </Link>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
