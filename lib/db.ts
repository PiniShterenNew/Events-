import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Database, Invitee, MessageRecord } from "@/types";

const PROJECT_DB_PATH = path.join(process.cwd(), "data", "db.json");
const SEED_PATH = path.join(process.cwd(), "data", "db.seed.json");
const RUNTIME_DB_PATH = process.env.VERCEL
  ? path.join(os.tmpdir(), "gatherly-db.json")
  : PROJECT_DB_PATH;

function ensureRuntimeDb(): void {
  if (fs.existsSync(RUNTIME_DB_PATH)) return;
  const source = fs.existsSync(SEED_PATH) ? SEED_PATH : PROJECT_DB_PATH;
  fs.copyFileSync(source, RUNTIME_DB_PATH);
}

export function readDb(): Database {
  ensureRuntimeDb();
  return JSON.parse(fs.readFileSync(RUNTIME_DB_PATH, "utf8")) as Database;
}

export function writeDb(db: Database): void {
  ensureRuntimeDb();
  fs.writeFileSync(RUNTIME_DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function getEvent() {
  return readDb().event;
}

export function getInvitees(): Invitee[] {
  return readDb().invitees;
}

export function getInviteeByToken(token: string): Invitee | undefined {
  return readDb().invitees.find((invitee) => invitee.token === token);
}

export function getPublicAttendees(): Invitee[] {
  return readDb().invitees.filter(
    (invitee) => invitee.status === "going" && invitee.profile.isPublic,
  );
}

export function addInvitee(invitee: Invitee): void {
  const db = readDb();
  db.invitees.unshift(invitee);
  writeDb(db);
}

export function updateInvitee(token: string, update: (invitee: Invitee) => Invitee): Invitee | null {
  const db = readDb();
  const index = db.invitees.findIndex((invitee) => invitee.token === token);
  if (index === -1) return null;
  db.invitees[index] = update(db.invitees[index]);
  writeDb(db);
  return db.invitees[index];
}

export function addMessage(message: MessageRecord): void {
  const db = readDb();
  db.messages.unshift(message);
  writeDb(db);
}

export function getMessages(): MessageRecord[] {
  return readDb().messages;
}
