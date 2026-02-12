"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type RatingValue = "happy" | "neutral" | "sad";

type RatingOption = {
  rating: RatingValue;
  emoji: string;
  label: string;
  ariaLabel: string;
  buttonClassName: string;
};

const ratingOptions: RatingOption[] = [
  {
    rating: "happy",
    emoji: "😃",
    label: "Buena",
    ariaLabel: "Calificación buena",
    buttonClassName:
      "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200",
  },
  {
    rating: "neutral",
    emoji: "😐",
    label: "Regular",
    ariaLabel: "Calificación regular",
    buttonClassName:
      "border-amber-200 bg-amber-50 hover:bg-amber-100 active:bg-amber-200",
  },
  {
    rating: "sad",
    emoji: "😞",
    label: "Mala",
    ariaLabel: "Calificación mala",
    buttonClassName: "border-rose-200 bg-rose-50 hover:bg-rose-100 active:bg-rose-200",
  },
];

export default function RatePage() {
  const searchParams = useSearchParams();
  const customerCode = useMemo(() => {
    const value = searchParams.get("code")?.trim() ?? "";
    return value.length > 0 ? value : null;
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRatingSelect = async (rating: RatingValue) => {
    if (isSubmitting || isSuccess) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          customerCode,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar la evaluación");
      }

      setIsSuccess(true);
      window.setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
      }, 3000);
    } catch {
      setError("No se pudo enviar la evaluación. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
        <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            ¡Gracias por tu evaluación!
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Tu respuesta ha sido registrada correctamente.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-100 px-6 py-10">
      <section className="mx-auto flex h-[calc(100vh-5rem)] w-full max-w-xl flex-col justify-center rounded-3xl bg-white p-8 shadow-lg sm:p-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Califica la atención recibida
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Tu opinión es importante para nosotros
          </p>
          {customerCode ? (
            <p className="mt-2 text-sm text-slate-500">Código de cliente: {customerCode}</p>
          ) : null}
        </header>

        <div className="mt-8 grid gap-4">
          {ratingOptions.map((option) => (
            <button
              key={option.rating}
              type="button"
              aria-label={option.ariaLabel}
              disabled={isSubmitting}
              onClick={() => handleRatingSelect(option.rating)}
              className={`flex min-h-[140px] w-full items-center justify-center gap-3 rounded-2xl border-2 px-6 py-5 text-left transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 ${option.buttonClassName} ${
                !isSubmitting ? "hover:-translate-y-0.5" : ""
              }`}
            >
              <span className="text-5xl" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="text-3xl font-semibold text-slate-900">{option.label}</span>
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-6 text-center text-sm font-medium text-rose-700">{error}</p>
        ) : null}
      </section>
    </main>
  );
}
