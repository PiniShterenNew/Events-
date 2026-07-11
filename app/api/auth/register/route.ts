import { redirect } from "next/navigation";
import { registerUser, setSession } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");

  if (password.length < 8) {
    redirect("/?auth=weak-password#auth");
  }

  let user;
  try {
    user = registerUser(name, email, password);
  } catch (error) {
    redirect("/?auth=exists#auth");
  }

  await setSession(user.id);
  redirect("/create-event");
}
