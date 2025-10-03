import { HeaderLayout } from "@/components/layouts/HeaderLayout";
import BackButton from "@/components/interactables/BackButton";

export default function AccountPage(){
    return (
        <main className="min-h-screen bg-zinc-50">
            <HeaderLayout left={<BackButton showReturnModal={false}/>}/>
        </main>
    )
}