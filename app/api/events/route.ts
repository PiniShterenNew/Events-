import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";

function slugify(input: string) {
  const fallback = `event-${Date.now().toString(36)}`;
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
}

export async function POST(request: Request) {
  await requireUser();
  const form = await request.formData();
  const title = String(form.get("title") || "אירוע חדש");
  const startsAtValue = String(form.get("startsAt") || "");
  const startsAt = startsAtValue ? new Date(startsAtValue).toISOString() : new Date().toISOString();
  const endsAt = new Date(new Date(startsAt).getTime() + 4 * 60 * 60 * 1000).toISOString();
  const rsvpDeadline = new Date(new Date(startsAt).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const db = readDb();
  db.event = {
    ...db.event,
    id: db.event.id || `event-${Date.now().toString(36)}`,
    slug: slugify(title),
    title,
    subtitle: "אירוע חדש שנוצר ב־Gatherly",
    description: String(form.get("description") || ""),
    hostName: String(form.get("hostName") || ""),
    startsAt,
    endsAt,
    locationName: String(form.get("locationName") || ""),
    locationAddress: String(form.get("locationAddress") || ""),
    navigationUrl: "https://waze.com/ul",
    dressCode: String(form.get("dressCode") || "נוח וחגיגי"),
    rsvpDeadline,
    attendeeDirectoryEnabled: true,
  };

  writeDb(db);
  redirect("/admin");
}
