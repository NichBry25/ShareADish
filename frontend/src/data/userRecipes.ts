import { GetRecipesUserPage } from "@/data/recipes";
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
  prompt: string;
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


export function GetUserRecipeMap(username:string) {
  const userRecipes = GetRecipesUserPage(username);

  const mappedUserRecipes = userRecipes.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    tags: r.tags ?? [],
    ingredients: r.ingredients,
    steps: r.instructions,
    nutrition: r.nutrition,
    prompt: r.original_prompt
  }));


  const userRecipeMap: Record<string, UserRecipe> = mappedUserRecipes.reduce((acc, recipe) => {
    acc[recipe.id] = recipe;
    return acc;
  }, {} as Record<string, UserRecipe>);

  return { userRecipes: mappedUserRecipes, userRecipeMap };
}

export function getUserRecipeList(username:string){
    const { userRecipes: userRecipeList, userRecipeMap } = GetUserRecipeMap(username);
    return userRecipeList
}


