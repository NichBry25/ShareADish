"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { StarRating } from "@/components/widgets/StarRating";
import { getTrendingRecipes } from "@/data/recipes";
import { placeholder } from "@/data/recipes";

export function TrendingRecipesWidget() {
  const recipes = getTrendingRecipes()

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Today's Trending Recipes</h2>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {
        recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/view-recipe/${recipe.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={placeholder} // TODO - fix this, use images from comments
                alt={recipe.title}
                fill
                sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition group-hover:scale-[1.02]"
                priority={false}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <h3 className="text-base font-medium text-zinc-900">{recipe.title}</h3>
              <div className="mt-3 flex items-center justify-between text-sm">
                <StarRating value={recipe.rating ?? 0} />
                <span className="text-xs text-zinc-500">{(recipe.no_rated ?? 0).toLocaleString()} ratings</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
