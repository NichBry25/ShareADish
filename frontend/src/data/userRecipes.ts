import { recipeMap } from "@/data/recipes";
import api from "@/lib/axios";

export type UserRecipe = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: string;
    carbohydrates: string;
    protein: string;
    fats: string;
    fiber: string;
  };
};

const fallbackNutrition = {
  calories: "480 kcal",
  carbohydrates: "62 g",
  protein: "18 g",
  fats: "15 g",
  fiber: "7 g",
};

const editableIds = [
  "fire-roasted-tomato-soup",
  "miso-maple-salmon-bowls",
  "grilled-peach-burrata-salad",
  "harissa-roasted-cauliflower",
  "maple-tahini-granola",
];



const createUserRecipe = (id: string): UserRecipe | null => {
  const detail = recipeMap[id];
  if (!detail) {
    return null;
  }

  return {
    id,
    title: detail.title,
    description: detail.description ?? "",
    tags: detail.tags,
    ingredients: detail.ingredients,
    steps: detail.instructions,
    nutrition: fallbackNutrition,
  };
};

const userRecipeEntries = editableIds
  .map((id) => createUserRecipe(id))
  .filter((recipe): recipe is UserRecipe => Boolean(recipe));

export const userRecipeMap: Record<string, UserRecipe> = userRecipeEntries.reduce((acc, recipe) => {
  acc[recipe.id] = recipe;
  return acc;
}, {} as Record<string, UserRecipe>);

export const userRecipes = userRecipeEntries;

export async function getUserRecipeById(id: string) {

  return userRecipeMap[id];
}
