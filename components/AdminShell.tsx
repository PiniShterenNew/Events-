import { AdminNav } from "@/components/AdminNav";

export function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminNav active={active} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
