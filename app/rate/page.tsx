"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type RatingValue = "happy" | "neutral" | "sad";

type RatingOption = {
  rating: RatingValue;
  emoji: string;
  label: string;
  ariaLabel: string;
  circleClassName: string;
};

const ratingOptions: RatingOption[] = [
  {
    rating: "happy",
    emoji: "😃",
    label: "Buena",
    ariaLabel: "Seleccionar evaluación buena",
    circleClassName: "bg-emerald-500/90 group-hover:bg-emerald-400 group-active:bg-emerald-600",
  },
  {
    rating: "neutral",
    emoji: "😐",
    label: "Regular",
    ariaLabel: "Seleccionar evaluación regular",
    circleClassName: "bg-amber-500/90 group-hover:bg-amber-400 group-active:bg-amber-600",
  },
  {
    rating: "sad",
    emoji: "😞",
    label: "Mala",
    ariaLabel: "Seleccionar evaluación mala",
    circleClassName: "bg-rose-500/90 group-hover:bg-rose-400 group-active:bg-rose-600",
  },
];

export default function RatePage() {
  const searchParams = useSearchParams();
  const initialCode = useMemo(() => searchParams.get("code")?.trim() ?? "", [searchParams]);

  const [customerCodeInput, setCustomerCodeInput] = useState(initialCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCustomerCodeInput(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      resetForm();
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSuccess]);

  const resetForm = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setError("");
  };

  const handleRatingSelect = async (rating: RatingValue) => {
    if (isSubmitting || isSuccess) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    const normalizedCode = customerCodeInput.trim();
    const customerCode = normalizedCode.length > 0 ? normalizedCode : null;

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
    } catch {
      setError("No se pudo enviar la evaluación. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  const hasCustomerCode = customerCodeInput.trim().length > 0;

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
        <section className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            ¡Gracias por tu evaluación!
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Tu respuesta ha sido registrada correctamente.
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-700 active:bg-slate-800"
          >
            Volver
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#334155_0%,#0f172a_45%,#020617_100%)]" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-10">
        <header className="text-center text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Califica la atención recibida</h1>
          <p className="mt-3 text-base text-slate-100 sm:text-lg">Tu opinión es importante para nosotros</p>
        </header>

        <div className="mt-6 rounded-2xl border border-white/25 bg-black/25 p-4 sm:p-5">
          <label htmlFor="codigoCliente" className="block text-sm font-medium text-white/90">
            Código del cliente (opcional)
          </label>
          <input
            id="codigoCliente"
            type="text"
            value={customerCodeInput}
            onChange={(event) => setCustomerCodeInput(event.target.value)}
            disabled={isSubmitting}
            placeholder="Ingresa un código"
            className="mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-white focus:ring-2 focus:ring-white/60 disabled:cursor-not-allowed disabled:opacity-70"
          />
          {hasCustomerCode ? (
            <p className="mt-2 text-sm text-slate-100">Código de cliente: {customerCodeInput.trim()}</p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {ratingOptions.map((option) => (
            <button
              key={option.rating}
              type="button"
              aria-label={option.ariaLabel}
              disabled={isSubmitting}
              onClick={() => handleRatingSelect(option.rating)}
              className="group flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-5 py-6 text-white shadow-lg transition duration-150 hover:-translate-y-1 hover:bg-white/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <span
                className={`flex h-20 w-20 items-center justify-center rounded-full text-5xl shadow-lg transition ${option.circleClassName}`}
                aria-hidden="true"
              >
                {option.emoji}
              </span>
              <span className="mt-4 text-2xl font-semibold">{option.label}</span>
              <span className="mt-3 h-8 w-8 rounded-md border-2 border-white/80 bg-black/20" aria-hidden="true" />
            </button>
          ))}
        </div>

        {error ? <p className="mt-6 text-center text-sm font-semibold text-rose-200">{error}</p> : null}
      </section>
    </main>
  );
}
