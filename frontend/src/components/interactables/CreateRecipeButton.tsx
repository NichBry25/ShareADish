"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateRecipeButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-3 animate-fade-in-up">
          <Link href="/create-recipe/manual">
            <button className="px-5 py-2 rounded-full bg-white text-[#344f1f] shadow hover:bg-neutral-100 transition">
              Manual
            </button>
          </Link>
          <Link href="/create-recipe/generate-ai">
            <button className="px-5 py-2 rounded-full bg-white text-[#344f1f] shadow hover:bg-neutral-100 transition">
              AI
            </button>
          </Link>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-6 py-3 rounded-full bg-[#344f1f] text-[#f9f5f0] shadow-lg hover:bg-[#2a3e19] transition"
      >
        {open ? "×" : "Generate!"}
      </button>
    </div>
  );
}
