'use server';
import api from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';

type Nutrition = {
    calories: string;
    carbohydrates: string;
    protein: string;
    fats: string;
    fiber: string;
} 


export type EditableRecipePayload = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: Nutrition;
};

export async function updateRecipe(payload: EditableRecipePayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  console.log('edit')
  console.log(payload)
  const res = await api.put(`/recipe/${payload.id}`, payload, {
    headers: {
      Cookie: `access_token=${token}`
    }
  });
  return res;
}
