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

const baseTrending: Recipe[] = [
  { id: "1", title: "Fire-Roasted Tomato Soup", rating: 4.8, ratingsCount: 214, image: placeholder },
  { id: "2", title: "Crispy Kimchi Pancakes", rating: 4.6, ratingsCount: 189, image: placeholder },
  { id: "3", title: "Miso Maple Salmon Bowls", rating: 4.9, ratingsCount: 322, image: placeholder },
  { id: "4", title: "Charred Corn Elote Dip", rating: 4.7, ratingsCount: 148, image: placeholder },
  { id: "5", title: "Molten Chocolate Babka", rating: 4.5, ratingsCount: 267, image: placeholder },
  { id: "6", title: "Coconut Lime Poke Bowl", rating: 4.8, ratingsCount: 193, image: placeholder },
];

export function TrendingRecipesWidget() {
  const [recipes] = useState<Recipe[]>(baseTrending);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Today's Trending Recipes</h2>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-zinc-50"
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
