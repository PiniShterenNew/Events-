import Link from "next/link";
import { CalendarIcon, MessageIcon, SparkIcon, UsersIcon } from "@/components/Icons";

const items = [
  { href: "/admin", label: "סקירה", icon: SparkIcon },
  { href: "/admin/invitees", label: "מוזמנים", icon: UsersIcon },
  { href: "/admin/messages", label: "הודעות", icon: MessageIcon },
  { href: "/e/pinhas-birthday", label: "עמוד האירוע", icon: CalendarIcon },
];

export function AdminNav({ active, userName, userEmail }: { active: string; userName: string; userEmail: string }) {
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="brand-lockup">
        <span className="brand-mark"><SparkIcon /></span>
        <span><strong>Gatherly</strong><small>אירועים שמחברים אנשים</small></span>
      </Link>
      <nav className="admin-menu" aria-label="ניווט ניהול">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={active === item.href ? "active" : ""}>
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-note user-note">
        <span className="status-dot" />
        <div><strong>{userName}</strong><p>{userEmail}</p><form action="/api/auth/logout" method="post"><button type="submit">יציאה</button></form></div>
      </div>
    </aside>
  );
}
