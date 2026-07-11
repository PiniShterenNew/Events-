import { redirect } from "next/navigation";
import { authenticateUser, setSession } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const user = authenticateUser(email, password);

  if (!user) {
    redirect("/?auth=invalid#auth");
  }

  await setSession(user.id);
  redirect("/admin");
}
