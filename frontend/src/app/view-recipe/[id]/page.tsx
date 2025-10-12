"use client";

import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AccountButton from "@/components/interactables/AccountButton";
import Brand from "@/components/interactables/Brand";
import CreateRecipeButton from "@/components/interactables/CreateRecipeButton";
import SearchField from "@/components/interactables/SearchField";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import RecipeDetailLoading from "@/components/layouts/loadings/RecipeDetailLoading";
import { StarRating } from "@/components/widgets/StarRating";
import { RecipeDetail, getRecipeById, placeholder } from "@/data/recipes";
import { getRecipeAuthor } from "@/data/recipeAuthors";
import { useAuth } from "@/app/context/AuthContext";
import { setRecipes } from "@/data/recipes";
import CommentDeleteButton from "@/components/widgets/DeleteCommentWidget";
import getImage from "@/lib/getRecipeImage";


export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const activeId = useMemo(() => {
    const rawId = params?.id;
    if (Array.isArray(rawId)) {
      return rawId[0];
    }
    return rawId ?? "";
  }, [params]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: authLoading } = useAuth();
  const [commentValue, setCommentValue] = useState("");
  const [ratingValue, setRatingValue] = useState<string>("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [rated,setRated] = useState(0);
  
  useEffect(() => {
    const fetchAndSetRecipe = async () => {
      if (!activeId) {
        setRecipe(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setRecipe(null);

      try {
        const response = await api.get("/recipe/");
        setRecipes(response.data.recipes);

        const fetchedRecipe = getRecipeById(activeId);
        setRecipe(fetchedRecipe ?? null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetRecipe();
  }, [activeId]);


    

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me", {
            headers: { Cookie: `access_token=${token}` },
        });
        if (res.status >= 200 && res.status <= 300) {
          setUsername(res.data.username);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchUser();
  }, []);

  const pageTitle = recipe?.title ?? "Loading recipe";
  const authorInfo = recipe?.created_by ?? 'Unknown'
  const isAuthenticated = Boolean(token);
  const interactionsDisabled = !isAuthenticated || authLoading;
  const authGuardMessage = !isAuthenticated
    ? authLoading
      ? "Checking your session…"
      : "Please log in to post comments or ratings."
    : undefined;


  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated || !commentValue.trim()) {
      return;
    }
    setIsCommentSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", commentValue);
      if(attachment){
        formData.append('image', attachment)
      }
      console.log(`Submitting comment "${commentValue}" for recipe ${activeId}`);
      const response = await api.put("recipe/comment/" + activeId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newCommentFromResponse = response.data.comment;

      setRecipe(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newCommentFromResponse]
      } : prev);
    } finally {
      setIsCommentSubmitting(false);
      setCommentValue("");
    }
  }

  async function handleRatingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated || !ratingValue) {
      return;
    }
    setIsRatingSubmitting(true);
    try {
      console.log(`Submitting rating ${ratingValue} for recipe ${activeId}`);
      await api.put(`/recipe/rate/${activeId}?rating=${ratingValue}`);
      alert("Rating submitted! Thank you for your feedback.");
      setRated(1)
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const message = error.response.data?.detail;
        alert(`Error: ${message}`);
      }
    } finally {
      setIsRatingSubmitting(false);
      setRatingValue("");
    }
  }
   
  const image = getImage(recipe)

  
  async function handleDeleteComment(id:string){
    if(confirm('Are you sure?')){
      try{
        await api.delete(`/recipe/comment/${activeId}/${id}`, {
              headers: { Cookie: `access_token=${token}` },
        });
      } catch(e){
        console.log(e)
      } finally{
        setRecipe(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== id)
        } : prev);
      }
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <HeaderLayout left={<Brand />} center={<SearchField />} right={<AccountButton />} />
      <CreateRecipeButton />
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="flex items-center gap-3 text-sm">
          <Link
            aria-label="Back to home"
            href="/"
            className="font-medium text-emerald-600 transition hover:text-emerald-500"
          >
            &larr; Back
          </Link>
          {recipe?.verified && !isLoading ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Verified
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <RecipeDetailLoading />
        ) : recipe ? (
          <article className="space-y-10">
            <div className="space-y-3">
              {authorInfo ? (
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900 sm:flex-row sm:items-center sm:gap-3">
                  <span className="font-semibold uppercase tracking-wide">Created by</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{authorInfo}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                  <StarRating value={recipe.rating ?? 0} />
                  <span className="text-xs uppercase tracking-wide text-zinc-500">
                    {(recipe.no_rated?recipe.no_rated+rated: 0).toLocaleString()} ratings
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">{pageTitle}</h1>
              {recipe.description ? (
                <p className="max-w-2xl text-base text-zinc-600">{recipe.description}</p>
              ) : null}
            </div>

            <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-zinc-100 bg-white sm:h-80">
              <Image
                src={image}
                alt={recipe.title}
                fill
                sizes="(min-width: 1280px) 960px, (min-width: 768px) 80vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Ingredients */}
              <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Ingredients</h2>
                  <span className="text-xs font-medium text-zinc-500">{recipe.ingredients.length} items</span>
                </div>
                <ul className="space-y-2 text-sm text-zinc-600">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Instructions */}
              <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Instructions</h2>
                  <span className="text-xs font-medium text-zinc-500">{recipe.instructions.length} steps</span>
                </div>
                <ol className="space-y-3 text-sm text-zinc-600">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={instruction} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Nutrition Facts */}
              <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm lg:col-span-2">
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Nutritional Information</h2>
                <ul className="grid grid-cols-2 gap-4 text-sm text-zinc-600 sm:grid-cols-5">
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.calories || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Calories</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.protein || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Protein</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.carbohydrates || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Carbs</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.fats || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Fats</span>
                  </li>
                  <li className="flex flex-col items-center rounded-lg bg-zinc-50 p-3">
                    <span className="text-lg font-semibold text-zinc-900">{recipe.nutrition.fiber || "-"}</span>
                    <span className="text-xs uppercase tracking-wide text-zinc-500">Fiber</span>
                  </li>
                </ul>
              </section>
            </div>

            <section className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Comments</h2>
              {recipe.comments.length > 0 ? (
                <ul className="space-y-3 text-sm text-zinc-600">
                  {recipe.comments.map((comment, index) => (
                    <li
                      key={comment.id ?? index}
                      className="rounded-2xl bg-zinc-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-800">{comment.username}</span>
                        <span className="text-xs text-zinc-400 flex items-center gap-2">
                          {
                          <>
                          {new Date(comment.created_at).toLocaleDateString()}
                          {
                            comment.username === username && comment.id ? (
                              <button
                                className="hover:text-red-500 transition"
                                onClick={() => handleDeleteComment(comment.id!)}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  className="w-5 h-5 transition"
                                >
                                  <path d="M14.2792,2C15.1401,2,15.9044,2.55086,16.1766,3.36754L16.7208,5L20,5C20.5523,5,21,5.44772,21,6C21,6.55227,20.5523,6.99998,20,7L19.9975,7.07125L19.1301,19.2137C19.018,20.7837,17.7117,22,16.1378,22H7.86224C6.28832,22,4.982,20.7837,4.86986,19.2137L4.00254,7.07125C4.00083,7.04735,3.99998,7.02359,3.99996,7C3.44769,6.99998,3,6.55227,3,6C3,5.44772,3.44772,5,4,5H7.27924L7.82339,3.36754C8.09562,2.55086,8.8599,2,9.72076,2H14.2792ZM17.9975,7H6.00255L6.86478,19.0712C6.90216,19.5946,7.3376,20,7.86224,20H16.1378C16.6624,20,17.0978,19.5946,17.1352,19.0712L17.9975,7ZM10,10C10.51285,10,10.9355092,10.386027,10.9932725,10.8833761L11,11V16C11,16.5523,10.5523,17,10,17C9.48715929,17,9.06449214,16.613973,9.00672766,16.1166239L9,16V11C9,10.4477,9.44771,10,10,10ZM14,10C14.5523,10,15,10.4477,15,11V16C15,16.5523,14.5523,17,14,17C13.4477,17,13,16.5523,13,16V11C13,10.4477,13.4477,10,14,10ZM14.2792,4H9.72076L9.38743,5H14.6126L14.2792,4Z" />
                                </svg>
                              </button>
                            ) : <></>
                          }
                          </>
                          }
                        </span>
                      </div>
                      <p className="mt-1 text-zinc-700">{comment.content}</p>
                      {
                        comment.image_url?
                        <Image
                          src={comment.image_url}
                          alt='Comment image'
                          width={200}
                          height={200}
                          className="object-cover rounded mt-3"
                          style={{ maxHeight: "200px", width: "auto" }}
                        />:<></>
                      }
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No comments yet.</p>
              )}
            </section>

            <section className="space-y-6 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900">Add a Comment</h2>
              </div>
              {authGuardMessage ? (
                <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900">
                  {authGuardMessage}
                </div>
              ) : null}
              <form className="space-y-2" onSubmit={handleCommentSubmit}>
                <div className="flex items-center justify-between">
                  {isCommentSubmitting ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-emerald-600">Sending…</span>
                  ) : null}
                </div>
                <div className="relative">
                  <textarea
                    value={commentValue}
                    onChange={(event) => setCommentValue(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    rows={4}
                    placeholder={isAuthenticated ? "Share what you tried or adjusted…" : "Log in to add a comment"}
                    disabled={interactionsDisabled || isCommentSubmitting}
                  />
                  <div className="absolute bottom-3 right-2">
                    <label className="bg-gray-100 hover:bg-gray-300 text-gray-700 rounded cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bi bi-upload" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
                          </svg>
                        <input type="file" className="hidden" onChange={onFileChange}/>
                    </label>
                  </div>
                </div>
                
                <p className="w-full text-wrap break-words montserrat">
                    {attachment 
                      ? "Attached files: " + attachment.name
                      : ""}
                </p>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      interactionsDisabled || isCommentSubmitting || !commentValue.trim()
                    }
                    className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    Post
                  </button>
                </div>
              </form>
              <div className="h-px w-full bg-zinc-100" />
              <form className="space-y-4" onSubmit={handleRatingSubmit}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">Add a rating</h3>
                  {isRatingSubmitting ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-emerald-600">Saving…</span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.5}
                      value={ratingValue}
                      onChange={(event) => setRatingValue(event.target.value)}
                      placeholder="4.5"
                      disabled={interactionsDisabled || isRatingSubmitting}
                      className="mt-2 w-24 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={interactionsDisabled || isRatingSubmitting || !ratingValue}
                    className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    Rate
                  </button>
                </div>
              </form>
            </section>

            <section className="space-y-2 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6">
              <h2 className="text-base font-semibold uppercase tracking-wide text-emerald-900">Original Prompt</h2>
              <p className="text-sm text-emerald-700">{recipe.original_prompt}</p>
            </section>
          </article>
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-zinc-900">Recipe not found</p>
            <p className="text-sm text-zinc-600">
              We couldn't locate that recipe. Please return to the homepage and choose another dish.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
