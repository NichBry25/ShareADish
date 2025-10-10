'use client'
import { getUserRecipeList } from "@/data/userRecipes";
import Link from "next/link";
import { useEffect } from "react";
import api from "@/lib/axios";
import { setRecipes } from "@/data/recipes";

type UserRecipeProp={
    username:string
}

export default function UserRecipesWidget({ username }:UserRecipeProp){

    useEffect(() => {
        const fetchRecipes = async () => {
        try {
            const response = await api.get('/recipe/')
            setRecipes(response.data.recipes)
            
        } catch (err){
            console.error('Failed to fetch recipes:', err)
        } 
        }

        fetchRecipes();
    }, []);
    const userRecipeList = getUserRecipeList(username)
    return(
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-900">Your Recipes</h2>
                <span className="text-sm text-neutral-500">{userRecipeList.length} recipes</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
                This list shows the dishes you&apos;ve created. Recipes will appear here once they&apos;re saved.
            </p>

            <div className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-2">
                {userRecipeList.map((recipe) => (
                    <article
                        key={recipe.id}
                        className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-lime-400 hover:shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-neutral-900">{recipe.title}</h3>
                        <p className="mt-1 text-sm text-neutral-600">{recipe.description}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2">
                                {recipe.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={`${recipe.id}-${tag}`}
                                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <Link
                                href={`/your-account/recipes/${recipe.id}`}
                                className="inline-flex items-center justify-center rounded-full border border-lime-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lime-900 shadow-sm transition hover:border-lime-500 hover:bg-lime-50"
                            >
                                Edit recipe
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}