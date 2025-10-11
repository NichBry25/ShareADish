"use client";

import { useRouter } from "next/navigation";
import RecipeEdit, { EditableRecipePayload } from "@/app/edit/RecipeEdit";


type CommentResponse = {
  id?: string;
  username: string;
  content: string;
  created_at: Date;
  image_url: string;
};

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
  comments: CommentResponse[];
  original_prompt: string;
};

type RecipeAccountEditorProps = {
  recipe: UserRecipe;
};

const redirectPath = "/";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RecipeAccountEditor({ recipe }: RecipeAccountEditorProps) {
  const router = useRouter();

  const handleSubmit = async (payload: EditableRecipePayload) => {
    router.push(redirectPath);
    router.refresh();
  };
  console.log('recipes/id recipe account edit')
  console.log(recipe)

  return <RecipeEdit recipe={recipe} onSubmit={handleSubmit} />;
}
