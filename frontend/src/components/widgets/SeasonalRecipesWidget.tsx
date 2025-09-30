"use client";

import Image from "next/image";
import { useState } from "react";
import { StarRating } from "@/components/widgets/StarRating";

type Recipe = {
  id: string;
  title: string;
  rating: number;
  ratingsCount: number;
  image: string;
};

const placeholder = "/images/placeholders/recipe-card.svg";

const baseSeasonal: Recipe[] = [
  { id: "1", title: "Grilled Peach Burrata Salad", rating: 4.7, ratingsCount: 134, image: placeholder },
  { id: "2", title: "Summer Herb Focaccia", rating: 4.9, ratingsCount: 201, image: placeholder },
  { id: "3", title: "Watermelon Chili Granita", rating: 4.6, ratingsCount: 98, image: placeholder },
  { id: "4", title: "Zucchini Blossom Quesadillas", rating: 4.8, ratingsCount: 122, image: placeholder },
  { id: "5", title: "Stone Fruit Galette", rating: 4.9, ratingsCount: 176, image: placeholder },
  { id: "6", title: "Cucumber Mint Gazpacho", rating: 4.5, ratingsCount: 87, image: placeholder },
];

export function SeasonalRecipesWidget() {
  const [recipes] = useState<Recipe[]>(baseSeasonal);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Seasonal Recipes</h2>
        <button
          type="button"
          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500"
        >
          View all
        </button>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/60"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <h3 className="text-base font-medium text-zinc-900">{recipe.title}</h3>
              <div className="mt-3 flex items-center justify-between text-sm">
                <StarRating value={recipe.rating} />
                <span className="text-xs text-zinc-500">{recipe.ratingsCount.toLocaleString()} ratings</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
