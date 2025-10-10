'use client';

import { useEffect } from "react";
import { MouseEvent, useMemo, useState } from "react";
import BackButton from "@/components/interactables/BackButton";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import CreateRecipeManualLoading from "@/components/layouts/loadings/CreateRecipeManualLoading";
import api from '@/lib/axios'
import { uploadRecipe } from "@/data/recipes";
import { useRouter } from 'next/navigation'

type ListItem = {
  id: string;
  value: string;
};

type Nutrition = {
    calories: string;
    carbohydrates: string;
    protein: string;
    fats: string;
    fiber: string;
} 

const instructionsCopy =
  "Start with the essentials - ingredients, steps, and nutrition details - to build your recipe from scratch.";

const makeId = () => Math.random().toString(36).slice(2, 10);

export default function CreateRecipeManual() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 
  const [ingredients, setIngredients] = useState<ListItem[]>([{ id: makeId(), value: "" }]);
  const [steps, setSteps] = useState<ListItem[]>([{ id: makeId(), value: "" }]);
  const [nutrition, setNutrition] = useState<Nutrition>(
    { calories: "", carbohydrates: "", protein: "", fats: "", fiber: "" },
  );

  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const tagOptions = ['Summer', 'Breakfast', 'Lunch', 'Dinner', 'Quick', 'Vegan', 'Vegetarian', 'Protein-Heavy', 'Dessert', 'Healthy']


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filledIngredients = useMemo(
    () => ingredients.map((item) => item.value.trim()).filter(Boolean),
    [ingredients],
  );

  const filledSteps = useMemo(
    () => steps.map((item) => item.value.trim()).filter(Boolean),
    [steps],
  );

  const resetFeedback = () => {
    setSaveFeedback(null);
    setFormError(null);
  };

  const handleAddIngredient = () => {
    resetFeedback();
    setIngredients((current) => [...current, { id: makeId(), value: "" }]);
  };

  const handleIngredientChange = (id: string, value: string) => {
    resetFeedback();
    setIngredients((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  const handleRemoveIngredient = (id: string) => {
    resetFeedback();
    setIngredients((current) => current.filter((item) => item.id !== id));
  };

  const handleAddStep = () => {
    resetFeedback();
    setSteps((current) => [...current, { id: makeId(), value: "" }]);
  };

  const handleStepChange = (id: string, value: string) => {
    resetFeedback();
    setSteps((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  const handleRemoveStep = (id: string) => {
    resetFeedback();
    setSteps((current) => current.filter((item) => item.id !== id));
  };


  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resetFeedback();
    handleRefreshNutritional()
    if (!title.trim()) {
      setFormError("Add a title so others know what the dish is called.");
      return;
    }

    if (!description.trim()) {
      setFormError("Include a short description to introduce your recipe.");
      return;
    }

    if (selectedTags.length === 0) {
      setFormError("Add at least one tag to help categorize the recipe.");
      return;
    }

    if (!filledIngredients.length) {
      setFormError("List at least one ingredient.");
      return;
    }

    if (!filledSteps.length) {
      setFormError("Add at least one step to describe the method.");
      return;
    }

    try{
        
        const response = await api.post("/recipe/",{ 
          title: title, 
          original_prompt: filledIngredients.join(', '), 
          description: description, 
          ingredients: filledIngredients,
          nutrition: nutrition,
          instructions: filledSteps,
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
    
    setSaveFeedback("All recipe details look great. You're ready to publish!");
  };

  const handleRefreshNutritional = async () => {
    const res = await api.post('/nutrition', {ingredients:ingredients.map(item=>item.value)})
    if(res.status >= 200 && res.status <= 300){
      const data = res.data
      setNutrition({
        calories: data.calories,
        carbohydrates: data.carbohydrates,
        protein: data.protein,
        fats: data.fats,
        fiber: data.fiber,
      })
    }
  }

  if (isLoading){
    return <CreateRecipeManualLoading />
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

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900">Manual Recipe Builder</h1>
        <p className="mt-2 text-sm text-neutral-600">{instructionsCopy}</p>

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Recipe Details</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Follow the same format as generated recipes by filling in the title, description, and comma-separated tags.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col">
              <label htmlFor="manualTitle" className="text-sm font-medium text-neutral-700">
                Title
              </label>
              <input
                id="manualTitle"
                type="text"
                value={title}
                onChange={(event) => {
                  resetFeedback();
                  setTitle(event.target.value);
                }}
                placeholder="Example: Smoky Chickpea & Spinach Stew"
                className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
              />
            </div>

            <div className="flex flex-col lg:col-span-2">
              <label htmlFor="manualDescription" className="text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                id="manualDescription"
                value={description}
                onChange={(event) => {
                  resetFeedback();
                  setDescription(event.target.value);
                }}
                placeholder="Describe the dish, serving suggestions, or preparation notes."
                className="mt-3 min-h-[7rem] resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
              />
            </div>

            <div className="flex flex-col lg:col-span-2">
                <label htmlFor="manualTags" className="text-sm font-medium text-neutral-700">
                    Tags
                </label>

                <div className="mt-3 flex items-center gap-3">
                    {/* Dropdown */}
                    <div className="relative w-40">
                    <select
                        id="manualTags"
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

                    {/* Custom arrow */}
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

                    {/* Pills */}
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <section className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Ingredients</h2>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="text-sm font-semibold text-[#344f1f] transition hover:text-[#2a3e19]"
                >
                  + Add ingredient
                </button>
              </div>
              <p className="mt-1 text-sm text-neutral-600">Capture each ingredient in its own field so it is easy to scan.</p>

              <div className="mt-4 space-y-3">
                {ingredients.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={item.value}
                      onChange={(event) => handleIngredientChange(item.id, event.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                      className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(item.id)}
                      className="rounded-md border border-neutral-200 px-2 py-2 text-xs font-medium text-neutral-500 transition hover:border-red-200 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Nutritional Value</h2>
                <button
                  type="button"
                  onClick={handleRefreshNutritional}
                  className="text-sm font-semibold text-[#344f1f] transition hover:text-[#2a3e19]"
                >
                  ⟳ Refresh
                </button>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Nutrition will show up here once fetched
              </p>

              <div className="mt-4 space-y-3">
                {                  
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                    <li><span className="font-semibold">Protein:</span> {nutrition.protein}</li>
                    <li><span className="font-semibold">Carbohydrates:</span> {nutrition.carbohydrates}</li>
                    <li><span className="font-semibold">Fiber:</span> {nutrition.fiber}</li>
                    <li><span className="font-semibold">Fat:</span> {nutrition.fats}</li>
                    <li><span className="font-semibold">Calories:</span> {nutrition.calories}</li>
                  </ul>
                }
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Steps</h2>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-sm font-semibold text-[#344f1f] transition hover:text-[#2a3e19]"
              >
                + Add step
              </button>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              Break down the method into clear, numbered instructions.
            </p>

            <div className="mt-4 space-y-4">
              {steps.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#344f1f]/10 text-sm font-semibold text-[#344f1f]">
                      {index + 1}
                    </span>
                    <textarea
                      value={item.value}
                      onChange={(event) => handleStepChange(item.id, event.target.value)}
                      placeholder={`Describe step ${index + 1}`}
                      className="min-h-[6rem] flex-1 resize-none rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#344f1f] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(item.id)}
                      className="rounded-md border border-neutral-200 px-2 py-2 text-xs font-medium text-neutral-500 transition hover:border-red-200 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
        {formError ? (
          <span className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 shadow">
            {formError}
          </span>
        ) : null}
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
