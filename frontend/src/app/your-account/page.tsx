import Link from "next/link";
import BackButton from "@/components/interactables/BackButton";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { requireAuth } from "@/lib/auth/requireAuth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { userRecipes } from "@/data/userRecipes";
import api from "@/lib/axios";
import { useAuth } from "../context/AuthContext";
export default async function page() {
    await requireAuth();
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    async function logoutAction() {
        "use server";

        (await cookies()).delete(AUTH_COOKIE_NAME);
        redirect("/login");
    }
    let username;
    
    try{
        const res = await api.get("/user/me", {
            headers: { Cookie: `access_token=${token}` },
        });
        if(res.status>=200 && res.status <=300){
            const data = res.data
            username = data.username
        }
    }catch (err) {
        console.error(err);
    }

    return (
        <main className="min-h-screen bg-zinc-50">
            <HeaderLayout
                left={
                    <BackButton showReturnModal={false}/>
                }
                right={
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="rounded-full border border-lime-300 bg-white px-5 py-2 text-sm font-semibold text-lime-900 shadow-sm transition hover:border-lime-500 hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                        >
                            Logout
                        </button>
                    </form>
                }
            />

            <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
                <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Account name</dt>
                            <dd className="mt-1 text-lg font-medium text-neutral-900">{username}</dd>
                        </div>
                    </dl>
                </section>

                {/* <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-neutral-900">Your Recipes</h2>
                        <span className="text-sm text-neutral-500">{userRecipes.length} recipes</span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">
                        This list shows the dishes you&apos;ve created. Recipes will appear here once they&apos;re saved.
                    </p>

                    <div className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-2">
                        {userRecipes.map((recipe) => (
                            <article
                                key={recipe.id}
                                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-lime-400 hover:shadow-md"
                            >
                                <h3 className="text-lg font-semibold text-neutral-900">{recipe.title}</h3>
                                <p className="mt-1 text-sm text-neutral-600">{recipe.description}</p>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={`${recipe.id}-${tag}`}
                                                className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/your-account/recipes/${recipe.id}`}
                                        className="inline-flex items-center justify-center rounded-full border border-lime-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lime-900 shadow-sm transition hover:border-lime-500 hover:bg-lime-50"
                                    >
                                        Edit recipe
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section> */}
            </div>
        </main>
    );
}
