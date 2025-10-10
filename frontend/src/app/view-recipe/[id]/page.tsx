"use client";

import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AccountButton from "@/components/interactables/AccountButton";
import Brand from "@/components/interactables/Brand";
import CreateRecipeButton from "@/components/interactables/CreateRecipeButton";
import SearchField from "@/components/interactables/SearchField";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import RecipeDetailLoading from "@/components/layouts/loadings/RecipeDetailLoading";
import { StarRating } from "@/components/widgets/StarRating";
import { RecipeDetail, getRecipeById, placeholder } from "@/data/recipes";
import { getRecipeAuthor } from "@/data/recipeAuthors";
import { useAuth } from "@/app/context/AuthContext";
import { setRecipes } from "@/data/recipes";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const activeId = useMemo(() => {
    const rawId = params?.id;
    if (Array.isArray(rawId)) {
      return rawId[0];
    }
    return rawId ?? "";
  }, [params]);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: authLoading } = useAuth();
  const [commentValue, setCommentValue] = useState("");
  const [ratingValue, setRatingValue] = useState<string>("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  
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

  useEffect(() => {
    if (!activeId) {
      setRecipe(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setRecipe(null);
    const timer = setTimeout(() => {
      setRecipe(getRecipeById(activeId) ?? null);
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [activeId]);


  const pageTitle = recipe?.title ?? "Loading recipe";
  const authorInfo = recipe?.created_by ?? 'Unknown'
  const isAuthenticated = Boolean(token);
  const interactionsDisabled = !isAuthenticated || authLoading;
  const authGuardMessage = !isAuthenticated
    ? authLoading
      ? "Checking your session…"
      : "Please log in to post comments or ratings."
    : undefined;

  const simulateNetworkDelay = (duration = 600) =>
    new Promise((resolve) => {
      setTimeout(resolve, duration);
    });  

  const triggerReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated || !commentValue.trim()) {
      return;
    }
    setIsCommentSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", commentValue);
      console.log(`Submitting comment "${commentValue}" for recipe ${activeId}`);
      const request = await api.put("recipe/comment/" + activeId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Comment submitted:", request.data);
    } finally {
      setIsCommentSubmitting(false);
      setCommentValue("");
      triggerReload();
    }
  }

  async function handleRatingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated || !ratingValue) {
      return;
    }
    setIsRatingSubmitting(true);
    try {
      console.log(`Submitting rating ${ratingValue} for recipe ${activeId}`);
      await api.put(`/recipe/rate/${activeId}?rating=${ratingValue}`);
      alert("Rating submitted! Thank you for your feedback.");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const message = error.response.data?.detail;
        alert(`Error: ${message}`);
      }
    } finally {
      setIsRatingSubmitting(false);
      setRatingValue("");
      triggerReload();
    }
  }
  let image = placeholder
  if(recipe != null && recipe.comments.length > 0 ){
    recipe.comments.forEach(comment=>{
      if(comment.image_url){
        let image = comment.image_url
      }
    })
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <HeaderLayout left={<Brand />} center={<SearchField />} right={<AccountButton />} />
      <CreateRecipeButton />
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="flex items-center gap-3 text-sm">
          <Link
            aria-label="Back to home"
            href="/"
            className="font-medium text-emerald-600 transition hover:text-emerald-500"
          >
            &larr; Back
          </Link>
          {recipe?.verified && !isLoading ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Verified
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <RecipeDetailLoading />
        ) : recipe ? (
          <article className="space-y-10">
            <div className="space-y-3">
              {authorInfo ? (
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900 sm:flex-row sm:items-center sm:gap-3">
                  <span className="font-semibold uppercase tracking-wide">Created by</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{authorInfo}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                  <StarRating value={recipe.rating ?? 0} />
                  <span className="text-xs uppercase tracking-wide text-zinc-500">
                    {(recipe.no_rated ?? 0).toLocaleString()} ratings
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">{pageTitle}</h1>
              {recipe.description ? (
                <p className="max-w-2xl text-base text-zinc-600">{recipe.description}</p>
              ) : null}
            </div>

            <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-zinc-100 bg-white sm:h-80">
              <Image
                src={image}
                alt={recipe.title}
                fill
                sizes="(min-width: 1280px) 960px, (min-width: 768px) 80vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Ingredients */}
              <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Ingredients</h2>
                  <span className="text-xs font-medium text-zinc-500">{recipe.ingredients.length} items</span>
                </div>
                <ul className="space-y-2 text-sm text-zinc-600">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Instructions */}
              <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Instructions</h2>
                  <span className="text-xs font-medium text-zinc-500">{recipe.instructions.length} steps</span>
                </div>
                <ol className="space-y-3 text-sm text-zinc-600">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={instruction} className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Nutrition Facts */}
              <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm lg:col-span-2">
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Nutritional Information</h2>
                <ul className="grid grid-cols-2 gap-4 text-sm text-zinc-600 sm:grid-cols-5">
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.calories || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Calories</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.protein || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Protein</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.carbohydrates || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Carbs</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.fats || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Fats</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.fiber || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Fiber</span>
                  </li>
                </ul>
              </section>
            </div>

            <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Comments</h2>
              {recipe.comments.length > 0 ? (
                <ul className="space-y-3 text-sm text-zinc-600">
                  {recipe.comments.map((comment, index) => (
                    <li
                      key={comment.id ?? index}
                      className="rounded-2xl bg-zinc-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-800">{comment.username}</span>
                        <span className="text-xs text-zinc-400">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-zinc-700">{comment.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No comments yet.</p>
              )}
            </section>

            <section className="space-y-6 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Add a Comment</h2>
              </div>
              {authGuardMessage ? (
                <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900">
                  {authGuardMessage}
                </div>
              ) : null}
              <form className="space-y-2" onSubmit={handleCommentSubmit}>
                <div className="flex items-center justify-between">
                  {isCommentSubmitting ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-emerald-600">Sending…</span>
                  ) : null}
                </div>
                <textarea
                  value={commentValue}
                  onChange={(event) => setCommentValue(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  rows={4}
                  placeholder={isAuthenticated ? "Share what you tried or adjusted…" : "Log in to add a comment"}
                  disabled={interactionsDisabled || isCommentSubmitting}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      interactionsDisabled || isCommentSubmitting || !commentValue.trim()
                    }
                    className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    Post
                  </button>
                </div>
              </form>
              <div className="h-px w-full bg-zinc-100" />
              <form className="space-y-4" onSubmit={handleRatingSubmit}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">Add a rating</h3>
                  {isRatingSubmitting ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-emerald-600">Saving…</span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.5}
                      value={ratingValue}
                      onChange={(event) => setRatingValue(event.target.value)}
                      placeholder="4.5"
                      disabled={interactionsDisabled || isRatingSubmitting}
                      className="mt-2 w-24 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={interactionsDisabled || isRatingSubmitting || !ratingValue}
                    className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    Rate
                  </button>
                </div>
              </form>
            </section>

            <section className="space-y-2 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6">
              <h2 className="text-base font-semibold uppercase tracking-wide text-emerald-900">Original Prompt</h2>
              <p className="text-sm text-emerald-700">{recipe.original_prompt}</p>
            </section>
          </article>
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-zinc-900">Recipe not found</p>
            <p className="text-sm text-zinc-600">
              We couldn't locate that recipe. Please return to the homepage and choose another dish.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
