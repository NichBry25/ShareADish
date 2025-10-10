"use client";

import { useRouter } from "next/navigation";
import RecipeEdit, { EditableRecipePayload } from "@/app/edit/RecipeEdit";


type UserRecipe = {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: string;
    carbohydrates: string;
    protein: string;
    fats: string;
    fiber: string;
  };
  prompt: string;
};

type RecipeAccountEditorProps = {
  recipe: UserRecipe;
};

const redirectPath = "/your-account";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RecipeAccountEditor({ recipe }: RecipeAccountEditorProps) {
  const router = useRouter();

  const handleSubmit = async (payload: EditableRecipePayload) => {
    await simulateRecipeUpdate(payload);
    router.push(redirectPath);
    router.refresh();
  };
  console.log("gljkdsngjsoghsh")
  console.log(recipe)

  return <RecipeEdit recipe={recipe} onSubmit={handleSubmit} />;
}

async function simulateRecipeUpdate(_payload: EditableRecipePayload) {
  await sleep(400);
}
