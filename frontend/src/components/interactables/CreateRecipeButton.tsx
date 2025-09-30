import Link from "next/link";

export default function CreateRecipeButton(){
    return (
        <Link href="/create-recipe">
            <button className="fixed bottom-6 right-6 z-50 px-6 py-3 text-[#f9f5f0] bg-[#344f1f] rounded-full shadow-lg hover:bg-[#344f1f] transition">
                Generate!
            </button>
        </Link>
    )
}