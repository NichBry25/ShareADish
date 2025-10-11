'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import BackButton from "@/components/interactables/BackButton";
import api from "@/lib/axios"
import CreateRecipeAILoading from "@/components/layouts/loadings/CreateRecipeAILoading";
import { useUsername } from "@/app/context/UsernameContext";
import { useRouter } from 'next/navigation'
import { uploadRecipe } from "@/data/recipes";

type GeneratedRecipe = {
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: string;
    carbohydrates: string;
    protein: string;
    fats: string;
    fiber: string;
  }
};

type CreatePageProp = {
  token:string;
}
const initialInstructions =
  "Describe what you are craving, dietary preferences, cooking method, or any ingredients you'd like to feature.";

export default function CreateRecipeAI({token}:CreatePageProp) {
  const router = useRouter();
  const { username } = useUsername()
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const tagOptions = ['Summer', 'Breakfast', 'Lunch', 'Dinner', 'Quick', 'Vegan', 'Vegetarian', 'Protein-Heavy', 'Dessert', 'Healthy']

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [])

  const hasGeneratedRecipe = useMemo(() => {
    if (!generatedRecipe) return false;
    return Boolean(generatedRecipe.ingredients.length && generatedRecipe.steps.length);
  }, [generatedRecipe]);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setErrorMessage("Please enter a prompt so we know what to cook.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.post("/ai/generate", { prompt: prompt.trim() });

      if (response.status == 429) {
        throw new Error("Rate limited");
      }

      if (response.status >= 400) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.data;
      const ingredients = Array.isArray(data?.ingredients) ? data.ingredients : [];
      const nutrition = data?.nutrients
      const steps = Array.isArray(data?.steps) ? data.steps : [];

      setGeneratedRecipe({ ingredients, steps, nutrition });
    } catch (error: unknown) {
      if(error instanceof Error){
        error.message === "Rate limited" ? 
        setErrorMessage('Rate limited. Please try again in 20s'): 
        setErrorMessage("We couldn't generate a recipe right now. Please try again.");
      }
      console.error(error);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    const trimmedPrompt = prompt.trim();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const tagList = selectedTags;

    setSaveFeedback(null);

    if (!hasGeneratedRecipe || !trimmedPrompt) {
      setSaveFeedback("Generate a recipe before saving.");
      return;
    }

    if (!trimmedTitle || !trimmedDescription || tagList.length === 0) {
      setSaveFeedback("Add a title, description, and at least one tag to continue.");
      return;
    }

      try{
        const response = await api.post("/recipe/",{ 
          title: trimmedTitle, 
          original_prompt: trimmedPrompt, 
          description: trimmedDescription, 
          ingredients: generatedRecipe?.ingredients,
          nutrition: generatedRecipe?.nutrition,
          instructions: generatedRecipe?.steps,
        })
        if(response.status >= 200 && response.status <=300){
          const res = await api.get(`/recipe/${response.data.id}`); 
          if(res.status >=200 && res.status <= 300){
            let new_recipe = res.data
            new_recipe.sections = ["feed"]
            uploadRecipe(new_recipe)
            router.replace(`/view-recipe/${response.data.id}`);
          }
        }
      }

     catch(error){
      console.log(error)
    }

    setSaveFeedback("All recipe details are ready. You're good to go!");
  };

  if (isLoading) {
    return <CreateRecipeAILoading />;
  }

  
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      <HeaderLayout
        left={
          <div className="flex items-center gap-4 text-[#f9f5f0]">
            <BackButton />
          </div>
        }
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-3">
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <form
            onSubmit={handleGenerate}
            className="flex min-h-[28rem] flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-neutral-900">Create Your Dish</h2>
              <textarea
                id="recipePrompt"
                name="recipePrompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Example: A hearty vegetarian pasta using mushrooms and spinach with a creamy sauce."
                className="mt-3 flex-1 resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
                rows={12}
              />
              <p className="mt-3 text-xs text-neutral-500">{initialInstructions}</p>
              {errorMessage ? (
                <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#344f1f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2a3e19] disabled:cursor-not-allowed disabled:bg-neutral-400"
              >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                        <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                        </svg>
                        Generating...
                    </div>
                    ) : (
                    "Generate"
                    )}
              </button>
            </div>
          </form>

          <section className="flex min-h-[28rem] flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Ingredients */}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Ingredients</h2>
                {generatedRecipe?.ingredients?.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={`${ingredient}-${index}`}>{ingredient}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-neutral-500">
                    Ingredients will appear here once we generate your recipe.
                  </p>
                )}
              </div>

              {/* Nutrition */}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Nutrition</h2>
                {generatedRecipe?.nutrition ? (
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                    <li><span className="font-semibold">Protein:</span> {generatedRecipe.nutrition.protein}</li>
                    <li><span className="font-semibold">Carbohydrates:</span> {generatedRecipe.nutrition.carbohydrates}</li>
                    <li><span className="font-semibold">Fiber:</span> {generatedRecipe.nutrition.fiber}</li>
                    <li><span className="font-semibold">Fat:</span> {generatedRecipe.nutrition.fats}</li>
                    <li><span className="font-semibold">Calories:</span> {generatedRecipe.nutrition.calories}</li>
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-neutral-500">
                    Nutritional values will appear here once we generate your recipe.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <h2 className="text-lg font-semibold text-neutral-900">Steps</h2>
              {generatedRecipe?.steps?.length ? (
                <ol className="mt-4 space-y-3 text-sm text-neutral-700">
                  {generatedRecipe.steps.map((step, index) => (
                    <li key={`${index}-${step.slice(0, 10)}`} className="flex gap-3">
                      <span className="font-semibold text-[#344f1f]">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-neutral-500">
                  We will list each cooking step here after your recipe is ready.
                </p>
              )}
            </div>
          </section>
        </div>

        {hasGeneratedRecipe ? (
          <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Add Recipe Details</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Give your dish a title, a short description, and comma-separated tags to help others find it.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="recipeTitle" className="text-sm font-medium text-neutral-700">
                  Title
                </label>
                <input
                  id="recipeTitle"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: Creamy Mushroom & Spinach Pasta"
                  className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
                />
              </div>

              <div className="flex flex-col lg:col-span-2">
                <label htmlFor="recipeDescription" className="text-sm font-medium text-neutral-700">
                  Description
                </label>
                <textarea
                  id="recipeDescription"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what makes this dish special, serving tips, or dietary notes."
                  className="mt-3 min-h-[7rem] resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
                />
              </div>

              <div className="flex flex-col lg:col-span-2">
                <label htmlFor="recipeTags" className="text-sm font-medium text-neutral-700">
                    Tags
                </label>

                <div className="mt-3 flex items-center gap-3">
                    <div className="relative w-40">
                        <select
                            id="recipeTags"
                            onChange={(e) => {
                            const tag = e.target.value;
                            if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
                                setSelectedTags((prev) => [...prev, tag]);
                            }
                            e.target.value = "";
                            }}
                            className="w-full appearance-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 pr-10 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
                            defaultValue=""
                        >
                            <option value="" disabled>
                            Select a tag...
                            </option>
                            {tagOptions.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                            ))}
                        </select>

                        <svg
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-[#344f1f] px-2.5 py-1 text-xs font-medium text-white"
                        >
                        {tag}
                        <button
                            type="button"
                            onClick={() =>
                            setSelectedTags((prev) => prev.filter((t) => t !== tag))
                            }
                            className="ml-1 text-white hover:text-red-300"
                        >
                            ×
                        </button>
                        </span>
                    ))}
                    </div>
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                    {selectedTags.length}/5 tags selected
                </p>
                </div>
            </div>
          </section>
        ) : null}
      </section>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
        {saveFeedback ? (
          <span className="rounded-lg bg-white/90 px-4 py-2 text-sm text-neutral-700 shadow">
            {saveFeedback}
          </span>
        ) : null}
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-[#344f1f] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#2a3e19]"
        >
          Save
        </button>
      </div>
    </main>
  );
}
