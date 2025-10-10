import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/requireAuth";
import RecipeAccountEditor from "./RecipeAccountEditor";
import api from "@/lib/axios";
interface AccountRecipePageProps {
  params: { id: string };
}

export default async function AccountRecipeEditPage({ params }: AccountRecipePageProps) {
  await requireAuth();
  const { id } = await params;

  const getUserRecipeById = async (id: string) => {
    const res = await api.get(`/recipe/${id}`)
    if(res.status >=200 && res.status <=300){
        return res.data;
    }
    return {};
}

  const recipe = await getUserRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return <RecipeAccountEditor recipe={recipe} />;
}
