"use client";

import Image from "next/image";
import { useState } from "react";
import { StarRating } from "@/components/widgets/StarRating";

type FeedItem = {
  id: string;
  title: string;
  rating: number;
  ratingsCount: number;
  author: string;
  summary: string;
  image: string;
};

const placeholder = "/images/placeholders/recipe-card.svg";

const baseFeed: FeedItem[] = [
  {
    id: "1",
    title: "Smoky Paprika Paella",
    author: "@theweeknightchef",
    rating: 4.8,
    ratingsCount: 412,
    summary: "Loaded with saffron rice, sweet peppers, and crispy chorizo edges.",
    image: placeholder,
  },
  {
    id: "2",
    title: "Caramelized Shallot Pasta",
    author: "@pasta_promise",
    rating: 4.6,
    ratingsCount: 389,
    summary: "Silky, sweet, and savory with a peppery finish everyone craves.",
    image: placeholder,
  },
  {
    id: "3",
    title: "Matcha Swirl Cheesecake",
    author: "@dessertsmith",
    rating: 4.9,
    ratingsCount: 521,
    summary: "A creamy swirl of vanilla and matcha on a toasted sesame crust.",
    image: placeholder,
  },
  {
    id: "4",
    title: "Harissa Roasted Cauliflower",
    author: "@plantplate",
    rating: 4.7,
    ratingsCount: 276,
    summary: "Roasted florets with citrus yogurt drizzle and crunchy pistachios.",
    image: placeholder,
  },
  {
    id: "5",
    title: "Vietnamese Iced Coffee Tiramisu",
    author: "@midnightcrumb",
    rating: 4.8,
    ratingsCount: 348,
    summary: "Layers of espresso-soaked ladyfingers and condensed milk mascarpone.",
    image: placeholder,
  },
  {
    id: "6",
    title: "Shiitake Miso Ramen",
    author: "@brothandbeyond",
    rating: 4.7,
    ratingsCount: 268,
    summary: "Deep umami broth, marinated egg, and charred corn for crunch.",
    image: placeholder,
  },
  {
    id: "7",
    title: "Citrus Basil Panna Cotta",
    author: "@citrusandcream",
    rating: 4.5,
    ratingsCount: 189,
    summary: "Velvety custard infused with basil and bright grapefruit segments.",
    image: placeholder,
  },
  {
    id: "8",
    title: "Black Garlic Smash Burgers",
    author: "@searedstories",
    rating: 4.6,
    ratingsCount: 321,
    summary: "Thin patties seared in butter with black garlic aioli and pickled onions.",
    image: placeholder,
  },
  {
    id: "9",
    title: "Maple Tahini Granola",
    author: "@breakfastbybeth",
    rating: 4.4,
    ratingsCount: 164,
    summary: "Clusters of toasted oats, sesame seeds, and maple-tahini drizzle.",
    image: placeholder,
  },
  {
    id: "10",
    title: "Golden Turmeric Latte Cake",
    author: "@spicedcrumbs",
    rating: 4.8,
    ratingsCount: 205,
    summary: "Earthy turmeric sponge with a coconut cream cheese frosting swirl.",
    image: placeholder,
  },
];

export function RecipeFeedWidget() {
  const [feed] = useState<FeedItem[]>(baseFeed.slice(0, 10));

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Spotlight Feed</h2>
        <button
          type="button"
          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500"
        >
          See more
        </button>
      </header>
      <div className="mt-6 h-[550px] overflow-hidden rounded-2xl border border-zinc-100">
        <ul className="flex h-full snap-y snap-mandatory flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {feed.map((item) => (
            <li
              key={item.id}
              className="flex border-b border-zinc-100 bg-white/90 p-5 last:border-b-0 snap-start"
            >
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative h-36 w-full overflow-hidden rounded-2xl sm:h-32 sm:w-36 lg:h-36 lg:w-40">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 144px, 88vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                        {item.author}
                      </p>
                      <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                    </div>
                    <StarRating value={item.rating} />
                  </div>
                  <p className="text-sm text-zinc-600">{item.summary}</p>
                  <span className="text-xs font-medium text-zinc-500">
                    {item.ratingsCount.toLocaleString()} people rated this
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
