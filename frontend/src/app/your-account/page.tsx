import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import BackButton from "@/components/interactables/BackButton";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function AccountPage(){
    await requireAuth();

    return (
        <main className="min-h-screen bg-zinc-50">
            <HeaderLayout left={<BackButton showReturnModal={false}/>}/>
        </main>
    )
}
