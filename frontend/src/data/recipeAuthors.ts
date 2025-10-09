export type RecipeAuthor = {
  id: string;
  handle: string;
  displayName?: string;
};

const recipeAuthors: RecipeAuthor[] = [
  { id: "fire-roasted-tomato-soup", handle: "@theweeknightchef"},
  { id: "crispy-kimchi-pancakes", handle: "@searedstories" },
  { id: "miso-maple-salmon-bowls", handle: "@brothandbeyond" },
  { id: "charred-corn-elote-dip", handle: "@plantplate" },
  { id: "molten-chocolate-babka", handle: "@midnightcrumb" },
  { id: "coconut-lime-poke-bowl", handle: "@islandbite" },
  { id: "grilled-peach-burrata-salad", handle: "@citrusandcream" },
  { id: "summer-herb-focaccia", handle: "@pasta_promise" },
  { id: "watermelon-chili-granita", handle: "@dessertsmith" },
  { id: "zucchini-blossom-quesadillas", handle: "@plantplate" },
  { id: "stone-fruit-galette", handle: "@dessertsmith" },
  { id: "cucumber-mint-gazpacho", handle: "@citrusandcream" },
  { id: "harissa-roasted-cauliflower", handle: "@plantplate" },
  { id: "black-garlic-smash-burgers", handle: "@searedstories" },
  { id: "shiitake-miso-ramen", handle: "@brothandbeyond" },
  { id: "smoky-paprika-paella", handle: "@theweeknightchef" },
  { id: "caramelized-shallot-pasta", handle: "@pasta_promise" },
  { id: "matcha-swirl-cheesecake", handle: "@dessertsmith" },
  { id: "vietnamese-iced-coffee-tiramisu", handle: "@midnightcrumb" },
  { id: "citrus-basil-panna-cotta", handle: "@citrusandcream" },
  { id: "maple-tahini-granola", handle: "@breakfastbybeth" },
  { id: "golden-turmeric-latte-cake", handle: "@spicedcrumbs" },
];

export const recipeAuthorMap: Record<string, RecipeAuthor> = recipeAuthors.reduce((acc, author) => {
  acc[author.id] = author;
  return acc;
}, {} as Record<string, RecipeAuthor>);

export function getRecipeAuthor(id: string) {
  return recipeAuthorMap[id];
}

export default recipeAuthors;
