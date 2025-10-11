"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import Brand from "@/components/interactables/Brand";
import SearchField from "@/components/interactables/SearchField";
import AccountButton from "@/components/interactables/AccountButton";
import CreateRecipeButton from "@/components/interactables/CreateRecipeButton";
import LoadingForMainPage from "@/components/layouts/loadings/MainPageLoading";
import api from "@/lib/axios";
import { getFeedRecipes, setRecipes, type WithSections } from "@/data/recipes";
import { RecipeFeedWidget } from "@/components/widgets/RecipeFeedWidget";

const TAG_OPTIONS = [
  "Summer",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Quick",
  "Vegan",
  "Vegetarian",
  "Protein-Heavy",
  "Dessert",
  "Healthy",
];

const TAG_SET = new Set(TAG_OPTIONS.map((t) => t.toLowerCase()));

export default function SearchOrTagPage() {
  const searchParams = useSearchParams();
  let tag = searchParams.get("tag");
  let id = searchParams.get("id");
  let query = `${id}, ${tag}`
  if(!id){
    id=''
    query=`${tag}`
  }
  if(!tag){
    tag = ''
    query = `${id}`
  }
  
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<WithSections[]>([]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setIsLoading(true);
      try{
        console.log({ query:id, tag:tag })
        const resp = await api.post('/recipe/search/',{ query:id, tag:tag });
        setRecipes(resp.data.recipes); // normalize & set in store
        const feed = getFeedRecipes();
        if (!active) return;
          setResults(feed);
        

      }catch (err) {
        console.error("Search/tag fetch failed:", err);
        if (!active) return;
        setResults([]);
      } finally {
        if (active) setIsLoading(false);
      }


      // const lower = id.toLowerCase();
      // const isTag = TAG_SET.has(lower);

      // try {
      //   if (isTag) {
      //     // Ensure we have a base list locally; if direct navigation, fetch all first.
      //     if (getFeedRecipes().length === 0) {
      //       const resp = await api.get("/recipe/");
      //       setRecipes(resp.data.recipes);
      //     }
      //     const all = getFeedRecipes();
      //     const filtered = all.filter((r) =>
      //       r.tags.some((t) => t.toLowerCase() === lower),
      //     );
      //     if (!active) return;
      //     setResults(filtered);
      //   } else {
      //     // Typed search -> backend

      //   }
      // } 
    };

    run();
    return () => {
      active = false;
    };
  }, [query]);

  if (isLoading) return <LoadingForMainPage />;

  return (
    <main className="min-h-screen bg-zinc-50">
      <HeaderLayout left={<Brand />} center={<SearchField />} right={<AccountButton />} />
      <CreateRecipeButton />
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-semibold text-zinc-800">
            Showing results for:{" "}
            <span className="text-emerald-600">{query}</span>
          </h1>
          <span className="text-sm text-zinc-500">{results.length} result{results.length === 1 ? "" : "s"}</span>
        </div>

        {/* Only Feed here (trending/seasonal intentionally hidden on the search page) */}
        <RecipeFeedWidget recipes={results} />

        {results.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No recipes found. Try a different search or tag.
          </p>
        ) : null}
      </div>
    </main>
  );
}
