import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { AddInviteeForm } from "@/components/AddInviteeForm";
import { Avatar } from "@/components/Avatar";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { StatusPill } from "@/components/StatusPill";
import { getEvent, getInvitees } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function InviteesPage() {
  const event = getEvent();
  const invitees = getInvitees();

  return (
    <AdminShell active="/admin/invitees">
      <header className="admin-header">
        <div><p className="eyebrow">רשימת תפוצה</p><h1 className="page-title">מוזמנים ואישורי הגעה</h1><p className="page-subtitle">כל מוזמן מקבל קישור אישי. ניתן לפתוח אותו, לעדכן RSVP ולבחור מה לחשוף.</p></div>
      </header>
      <AddInviteeForm />
      <div className="table-toolbar"><div className="searchbox"><input className="input" placeholder="חיפוש לפי שם, קבוצה או טלפון" disabled title="חיפוש יתווסף בחיבור למסד נתונים" /></div><span className="muted">{invitees.length} מוזמנים</span></div>
      <div className="card table-card"><div className="table-scroll"><table className="invitee-table"><thead><tr><th>מוזמן</th><th>קבוצה</th><th>סטטוס</th><th>כמות</th><th>פרופיל ציבורי</th><th>קישור אישי</th></tr></thead><tbody>
        {invitees.map((invitee) => <tr key={invitee.id}>
          <td><div className="person-cell"><Avatar seed={invitee.profile.avatarSeed} size="sm" /><div><strong>{invitee.firstName} {invitee.lastName}</strong><small>{invitee.phone}{invitee.email ? ` · ${invitee.email}` : ""}</small></div></div></td>
          <td>{invitee.group}</td>
          <td><StatusPill status={invitee.status} /></td>
          <td>{invitee.status === "going" ? invitee.guestCount : "—"} / {invitee.maxGuests}</td>
          <td>{invitee.profile.isPublic ? "כן" : "לא"}</td>
          <td><div style={{ display: "flex", gap: 10, alignItems: "center" }}><Link className="copy-link" href={`/e/${event.slug}/invite/${invitee.token}`}>פתיחה</Link><CopyLinkButton path={`/e/${event.slug}/invite/${invitee.token}`} /></div></td>
        </tr>)}
      </tbody></table></div></div>
    </AdminShell>
  );
}
