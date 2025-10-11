import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/requireAuth";
import RecipeAccountEditor from "./RecipeAccountEditor";
import api from "@/lib/axios";
interface AccountRecipePageProps {
  params: Promise<{ id: string }> | { id: string };
}
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
  original_prompt: string;
  comments: CommentResponse[]
};

export default async function AccountRecipeEditPage({ params }: AccountRecipePageProps) {
  await requireAuth();
  const { id } = await params;

  const getUserRecipeById = async (id: string):Promise<UserRecipe | undefined> => {
    const res = await api.get(`/recipe/${id}`)
    if(res.status >=200 && res.status <=300){
        return res.data;
    }
    return;
}

  const recipe = await getUserRecipeById(id);

  if (!recipe) {
    notFound();
  }
  console.log('recipes/id')
  console.log(recipe)

  return <RecipeAccountEditor recipe={recipe} />;
}
