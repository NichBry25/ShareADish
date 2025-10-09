import { requireAuth } from "@/lib/auth/requireAuth";
import CreateRecipeAI from "./CreatePage";

export default async function CreateRecipeAIPage() {
  const token = await requireAuth(); 

  return <CreateRecipeAI token={token}/>;
}
