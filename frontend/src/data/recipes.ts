export const placeholder = "/images/placeholders/recipe-card.svg";

type CommentResponse = {
  id?: string;
  username: string;
  content: string;
  created_at: Date;
  image_url: string;
};

type Nutrient = {
  protein: string;
  carbohydrates: string;
  fiber: string;
  fats: string;
  calories: string;
};


export type RecipeDetail = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition: Nutrient;
  comments: CommentResponse[];
  rating?: number;
  no_rated?: number;
  tags: string[];
  original_prompt: string;
  verified: boolean;
  created_by: string;
  created_time: Date;
  updated_at: Date;
};

export type WithSections = RecipeDetail & {
  sections: Array<"trending" | "seasonal" | "feed">;
};

let recipeDetails: WithSections[] = [];

// SETTER
export function setRecipes(apiRecipes: any[]) {
  console.log(apiRecipes);

  // 1. Build the full recipe list first without sections
  const mapped = apiRecipes.map((recipe) => ({
    id: recipe._id,
    title: recipe.title,
    description: recipe.description ?? "",
    ingredients: recipe.ingredients ?? [],
    instructions: recipe.instructions ?? [],
    nutrition: {
      protein: recipe.nutrition?.protein ?? "",
      carbohydrates: recipe.nutrition?.carbohydrates ?? "",
      fiber: recipe.nutrition?.fiber ?? "",
      fats: recipe.nutrition?.fats ?? "",
      calories: recipe.nutrition?.calories ?? "",
    },
    comments: (recipe.comments ?? []).map((c: any) => ({
      id: c.id,
      username: c.username,
      content: c.content,
      created_at: c.created_at ? new Date(c.created_at) : new Date(),
      image_url: c.image_url,
    })),
    rating: recipe.rating ?? 0,
    no_rated: recipe.no_rated ?? 0,
    tags: recipe.tags ?? [],
    original_prompt: recipe.original_prompt ?? "",
    verified: recipe.verified ?? false,
    created_by: recipe.created_by ?? "anonymous",
    created_time: recipe.created_time ? new Date(recipe.created_time) : new Date(),
    updated_at: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
    sections: ["feed"], // everything is in feed by default
  }));

  // 2. Sort + assign trending (top 6 by no_rated)
  const trendingIds = [...mapped]
    .sort((a, b) => (b.no_rated ?? 0) - (a.no_rated ?? 0))
    .slice(0, 6)
    .map((r) => r.id);

  // 3. Sort + assign seasonal (tag contains "Summer" + top 6 by rating)
  const seasonalIds = [...mapped]
    .filter((r) => r.tags.some((tag: string) => tag.toLowerCase() === "summer"))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)
    .map((r) => r.id);

  // 4. Merge sections back
  recipeDetails = mapped.map((r) => {
    const sections: WithSections["sections"] = ["feed"];
    if (trendingIds.includes(r.id)) sections.push("trending");
    if (seasonalIds.includes(r.id)) sections.push("seasonal");
    return { ...r, sections };
  });

  console.log("recipeDetails:");
  console.log(recipeDetails);
}

// GETTERS
export function getAllRecipes() {
  return recipeDetails;
}

export function getRecipeById(id: string) {
  return recipeDetails.find((r) => r.id === id);
}

export function filterBySection(section: "trending" | "seasonal" | "feed") {
  return recipeDetails.filter((recipe) => recipe.sections.includes(section));
}

export function getTrendingRecipes() {
  return filterBySection("trending");
}

export function getSeasonalRecipes() {
  return filterBySection("seasonal");
}

export function getFeedRecipes() {
  return filterBySection("feed");
}

export function allRecipeIds() {
  return recipeDetails.map((recipe) => recipe.id);
}

export function uploadRecipe(recipe: WithSections) {
  recipeDetails.push(recipe);
}

export function GetRecipesUserPage(username:string){
  const userRecipes = getAllRecipes()
    .filter((recipe) => recipe.created_by === username)
    .map(({ sections, ...rest }) => rest);
  console.log(userRecipes)
  return userRecipes;
}