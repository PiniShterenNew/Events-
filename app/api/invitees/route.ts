import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { addInvitee, getEvent } from "@/lib/db";
import type { Invitee } from "@/types";

export const runtime = "nodejs";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName