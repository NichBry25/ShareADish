import AccountButton from "@/components/interactables/AccountButton";
import Brand from "@/components/interactables/Brand";
import SearchField from "@/components/interactables/SearchField";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import RecipeDetailLoading from "@/components/layouts/loadings/RecipeDetailLoading";

export default function LoadingRecipeView() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <HeaderLayout left={<Brand />} center={<SearchField />} right={<AccountButton />} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <RecipeDetailLoading />
      </div>
    </main>
  );
}
