import { NextResponse } from "next/server";
import { updateInvitee } from "@/lib/db";
import type { InviteeProfile, RSVPStatus } from "@/types";

export const runtime = "nodejs";

const allowedStatuses = new Set<RSVPStatus>(["going", "maybe", "declined"]);
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await request.json();
    const status = body.status as RSVPStatus;
    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ error: "יש לבחור תשובת הגעה תקינה." }, { status: 400 });
    }

    const updated = updateInvitee(token, (invitee) => {
      const incomingProfile = body.profile ?? {};
      const profile: InviteeProfile = {
        ...invitee.profile,
        isPublic: status === "going" && Boolean(incomingProfile.isPublic),
        displayName: text(incomingProfile.displayName) || invitee.firstName,
        occupation: text(incomingProfile.occupation),
        interests: Array.isArray(incomingProfile.interests) ? incomingProfile.interests.map(text).filter(Boolean).slice(0, 8) : [],
        city: text(incomingProfile.city),
        instagramUsername: text(incomingProfile.instagramUsername).replace(/^@/, ""),
        bio: text(incomingProfile.bio).slice(0, 180),
        showOccupation: Boolean(incomingProfile.showOccupation),
        showInterests: Boolean(incomingProfile.showInterests),
        showInstagram: Boolean(incomingProfile.showInstagram),
      };
      return {
        ...invitee,
        status,
        guestCount: status === "going" ? Math.max(1, Math.min(invitee.maxGuests, Number(body.guestCount) || 1)) : 0,
        guestNames: status === "going" ? text(body.guestNames) : "",
        dietaryNotes: status === "going" ? text(body.dietaryNotes) : "",
        noteToHost: text(body.noteToHost),
        openedAt: invitee.openedAt ?? new Date().toISOString(),
        respondedAt: new Date().toISOString(),
        profile,
      };
    });

    if (!updated) return NextResponse.json({ error: "ההזמנה לא נמצאה." }, { status: 404 });
    return NextResponse.json({ invitee: updated });
  } catch {
    return NextResponse.json({ error: "לא ניתן לשמור את התגובה." }, { status: 400 });
  }
}
