import { AdminNav } from "@/components/AdminNav";
import { requireUser } from "@/lib/auth";

export async function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="admin-layout">
      <AdminNav active={active} userName={user.name} userEmail={user.email} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
