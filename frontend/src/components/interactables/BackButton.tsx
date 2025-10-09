'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  showReturnModal?: boolean;
}

export default function BackButton({ showReturnModal = true }: BackButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = useCallback(() => {
    setShowModal(false);
    router.push("/"); // ✅ Always go to homepage
  }, [router]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal, handleCancel]);

  const handleClick = () => {
    if (showReturnModal) {
      setShowModal(true);
    } else {
      router.push("/"); // ✅ Go straight to homepage without modal
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-[#f9f5f0] transition hover:text-white"
      >
        ← Back
      </button>

      {showModal ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="back-navigation-heading"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2
              id="back-navigation-heading"
              className="text-lg font-semibold text-neutral-900"
            >
              Leave this page?
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Your progress will not be saved.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-md bg-[#344f1f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2a3e19]"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
