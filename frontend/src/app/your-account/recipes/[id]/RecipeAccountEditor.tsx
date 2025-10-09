"use client";

import { useRouter } from "next/navigation";
import RecipeEdit, { EditableRecipePayload } from "@/app/edit/RecipeEdit";
import type { UserRecipe } from "@/data/userRecipes";

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

  return <RecipeEdit recipe={recipe} onSubmit={handleSubmit} />;
}

async function simulateRecipeUpdate(_payload: EditableRecipePayload) {
  await sleep(400);
}
