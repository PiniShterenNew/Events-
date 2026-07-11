import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDb, writeDb } from "@/lib/db";
import type { UserRecord } from "@/types";

const SESSION_COOKIE = "gatherly_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;
const HASH_ITERATIONS = 120_000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createPasswordHash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");
  return `${HASH_ITERATIONS}:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [iterationsValue, salt, hash] = storedHash.split(":");
  const iterations = Number(iterationsValue);
  if (!iterations || !salt || !hash) return false;

  const candidate = crypto
    .pbkdf2Sync(password, salt, iterations, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}

function createSessionToken(userId: string): string {
  const signature = crypto
    .createHmac("sha256", process.env.AUTH_SECRET || "gatherly-local-development-secret")
    .update(userId)
    .digest("hex");
  return `${userId}.${signature}`;
}

function readSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;

  const expected = createSessionToken(userId).split(".")[1];
  if (signature.length !== expected.length) return null;
  const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return isValid ? userId : null;
}

export function registerUser(name: string, email: string, password: string): UserRecord {
  const cleanEmail = normalizeEmail(email);
  const db = readDb();
  db.users ||= [];
  if (db.users.some((user) => user.email === cleanEmail)) {
    throw new Error("USER_EXISTS");
  }

  const user: UserRecord = {
    id: `user-${crypto.randomUUID()}`,
    name: name.trim() || cleanEmail.split("@")[0],
    email: cleanEmail,
    passwordHash: createPasswordHash(password),
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);
  return user;
}

export function authenticateUser(email: string, password: string): UserRecord | null {
  const db = readDb();
  const user = (db.users || []).find((record) => record.email === normalizeEmail(email));
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  const cookieStore = await cookies();
  const userId = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return (readDb().users || []).find((user) => user.id === userId) || null;
}

export async function requireUser(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) redirect("/?auth=required#auth");
  return user;
}
