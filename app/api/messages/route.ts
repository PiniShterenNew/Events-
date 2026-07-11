import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { addMessage, getEvent, getInvitees } from "@/lib/db";
import type { MessageRecord } from "@/types";

export const runtime = "nodejs";

const audiences = new Set(["all", "pending", "going", "maybe"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const audience = String(body.audience);
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!audiences.has(audience) || !content) {
      return NextResponse.json({ error: "קהל יעד ותוכן הודעה הם שדות חובה." }, { status: 400 });
    }
    const invitees = getInvitees();
    const recipients = audience === "all" ? invitees.length : invitees.filter((i) => i.status === audience).length;
    const message: MessageRecord = {
      id: randomUUID(),
      eventId: getEvent().id,
      audience: audience as MessageRecord["audience"],
      content: content.slice(0, 1000),
      recipients,
      status: "simulated",
      createdAt: new Date().toISOString(),
    };
    addMessage(message);
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "לא ניתן לשמור את ההודעה." }, { status: 400 });
  }
}
