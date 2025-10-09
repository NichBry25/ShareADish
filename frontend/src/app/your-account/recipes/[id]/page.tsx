import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/requireAuth";
import RecipeAccountEditor from "./RecipeAccountEditor";
import { getUserRecipeById } from "@/data/userRecipes";

interface AccountRecipePageProps {
  params: { id: string };
}

export default async function AccountRecipeEditPage({ params }: AccountRecipePageProps) {
  await requireAuth();
  const { id } = await params;
  const recipe = await getUserRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return <RecipeAccountEditor recipe={recipe} />;
}
