'use client';

import api from "@/lib/axios";
import { useState, useEffect } from "react";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import { RecipeFeedWidget } from "@/components/widgets/RecipeFeedWidget";
import { SeasonalRecipesWidget } from "@/components/widgets/SeasonalRecipesWidget";
import { TrendingRecipesWidget } from "@/components/widgets/TrendingRecipesWidget";
import Brand from "@/components/interactables/Brand";
import SearchField from "@/components/interactables/SearchField";
import AccountButton from "@/components/interactables/AccountButton";
import CreateRecipeButton from "@/components/interactables/CreateRecipeButton";
import LoadingForMainPage from "@/components/layouts/loadings/MainPageLoading"
import { setRecipes } from "@/data/recipes";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recipe/')
        setRecipes(response.data.recipes)
        
      } catch (err){
        console.error('Failed to fetch recipes:', err)
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (isLoading){
    return <LoadingForMainPage />;
  }
  

  return (
    <main className="min-h-screen bg-zinc-50">
      <HeaderLayout left={<Brand />} center={<SearchField />} right={<AccountButton />} />
      <CreateRecipeButton />
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        {
          <>
            <TrendingRecipesWidget />
            <SeasonalRecipesWidget />
            <RecipeFeedWidget />
          </>
        }
      </div>
    </main>
  );
}
