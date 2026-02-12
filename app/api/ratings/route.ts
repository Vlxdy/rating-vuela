import { NextResponse } from "next/server";

type RatingValue = "happy" | "neutral" | "sad";

type RatingRecord = {
  rating: RatingValue;
  customerCode: string | null;
  createdAt: string;
};

const validRatings: readonly RatingValue[] = ["happy", "neutral", "sad"];
const ratingsStore: RatingRecord[] = [];

function isValidPayload(data: unknown): data is RatingRecord {
  if (!data || typeof data !== "object") {
    return false;
  }

  const payload = data as Partial<RatingRecord>;

  const isRatingValid =
    typeof payload.rating === "string" &&
    validRatings.includes(payload.rating as RatingValue);

  const isCustomerCodeValid =
    payload.customerCode === null || typeof payload.customerCode === "string";

  const isCreatedAtValid =
    typeof payload.createdAt === "string" &&
    !Number.isNaN(Date.parse(payload.createdAt)) &&
    payload.createdAt === new Date(payload.createdAt).toISOString();

  return isRatingValid && isCustomerCodeValid && isCreatedAtValid;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { success: false, error: "Datos inválidos" },
      { status: 400 }
    );
  }

  ratingsStore.push(body);

  return NextResponse.json({ success: true });
}

export function GET() {
  return NextResponse.json({ items: ratingsStore });
}

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, error: "Método no permitido" },
    { status: 405 }
  );
}

export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
