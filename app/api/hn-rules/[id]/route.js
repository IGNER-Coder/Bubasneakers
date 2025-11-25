import { NextResponse } from "next/server";

// This is a dummy route to fix the Vercel build error.
// It does nothing but return a success message.

export async function GET(request, { params }) {
  return NextResponse.json({ message: "Ghost file pacified" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ message: "Ghost file pacified" });
}