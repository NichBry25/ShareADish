import { requireAuth } from "@/lib/auth/requireAuth";
import CreateRecipeManual from "./CreatePage";

export default async function CreateRecipeAIPage() {
  await requireAuth(); 

  return <CreateRecipeManual />;
}
