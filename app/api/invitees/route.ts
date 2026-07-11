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
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const phone = clean(body.phone);
    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ error: "שם פרטי, שם משפחה וטלפון הם שדות חובה." }, { status: 400 });
    }

    const event = getEvent();
    const token = `${firstName.toLowerCase().replace(/\s+/g, "-")}-${randomUUID().slice(0, 6)}`;
    const invitee: Invitee = {
      id: randomUUID(),
      eventId: event.id,
      firstName,
      lastName,
      phone,
      email: clean(body.email),
      token,
      group: clean(body.group) || "אחר",
      maxGuests: Math.max(1, Math.min(10, Number(body.maxGuests) || 1)),
      status: "pending",
      guestCount: 1,
      guestNames: "",
      dietaryNotes: "",
      noteToHost: "",
      openedAt: null,
      respondedAt: null,
      profile: {
        isPublic: false,
        displayName: firstName,
        occupation: "",
        interests: [],
        city: "",
        instagramUsername: "",
        bio: "",
        showOccupation: true,
        showInterests: true,
        showInstagram: false,
        avatarSeed: `${firstName[0] ?? ""}${lastName[0] ?? ""}`,
      },
    };
    addInvitee(invitee);
    return NextResponse.json({ invitee }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "הבקשה אינה תקינה." }, { status: 400 });
  }
}
