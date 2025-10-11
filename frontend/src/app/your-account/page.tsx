
import BackButton from "@/components/interactables/BackButton";
import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { requireAuth } from "@/lib/auth/requireAuth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/lib/axios";
import UserRecipesWidget from "@/components/widgets/UserRecipesWidget";

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
                <UserRecipesWidget username={username}/>
            </div>
        </main>
    );
}
