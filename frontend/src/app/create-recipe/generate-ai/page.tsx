import { requireAuth } from "@/lib/auth/requireAuth";
import CreateRecipeAI from "./CreatePage";

export default async function CreateRecipeAIPage() {
  await requireAuth(); 

  return <CreateRecipeAI />;
}
