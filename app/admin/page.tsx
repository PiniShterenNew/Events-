import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Avatar } from "@/components/Avatar";
import { CalendarIcon, ExternalIcon, LocationIcon, MessageIcon, UsersIcon } from "@/components/Icons";
import { StatusPill } from "@/components/StatusPill";
import { formatEventDate, formatTime } from "@/lib/format";
import { getEvent, getInvitees } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const event = getEvent();
  const invitees = getInvitees();
  const going = invitees.filter((i) => i.status === "going");
  const pending = invitees.filter((i) => i.status === "pending");
  const publicProfiles = going.filter((i) => i.profile.isPublic);
  const confirmedGuests = going.reduce((sum, i) => sum + i.guestCount, 0);
  const responseRate = invitees.length ? Math.round(((invitees.length - pending.length) / invitees.length) * 100) : 0;

  const recent = [...invitees]
    .filter((i) => i.respondedAt)
    .sort((a, b) => new Date(b.respondedAt!).getTime() - new Date(a.respondedAt!).getTime())
    .slice(0, 4);

  return (
    <AdminShell active="/admin">
      <header className="admin-header">
        <div><p className="eyebrow">מרכז ניהול</p><h1 className="page-title">האירוע שלך, במבט אחד</h1><p className="page-subtitle">עקוב אחר אישורי ההגעה, פרופילים ציבוריים והודעות שנשלחו.</p></div>
        <div className="header-actions"><Link className="btn btn-secondary" href={`/e/${event.slug}`}><ExternalIcon />תצוגת האירוע</Link><Link className="btn btn-primary" href="/admin/messages"><MessageIcon />שליחת הודעה</Link></div>
      </header>

      <section className="stats-grid">
        <div className="card stat-card"><div className="stat-top"><span>סך מוזמנים</span><span className="stat-icon"><UsersIcon /></span></div><div className="stat-value">{invitees.length}</div><div className="stat-caption">ב־{new Set(invitees.map((i) => i.group)).size} קבוצות</div></div>
        <div className="card stat-card"><div className="stat-top"><span>אישרו הגעה</span><span className="stat-icon"><CalendarIcon /></span></div><div className="stat-value">{confirmedGuests}</div><div className="stat-caption">{going.length} הזמנות מאושרות</div></div>
        <div className="card stat-card"><div className="stat-top"><span>טרם ענו</span><span className="stat-icon"><MessageIcon /></span></div><div className="stat-value">{pending.length}</div><div className="stat-caption">ממתינים לתזכורת</div></div>
        <div className="card stat-card"><div className="stat-top"><span>פרופילים ציבוריים</span><span className="stat-icon"><UsersIcon /></span></div><div className="stat-value">{publicProfiles.length}</div><div className="stat-caption">בהסכמה מפורשת</div></div>
      </section>

      <section className="dashboard-grid">
        <div className="card panel">
          <div className="panel-head"><h2>פעילות אחרונה</h2><Link href="/admin/invitees">לכל המוזמנים</Link></div>
          <div className="activity-list">
            {recent.length ? recent.map((invitee) => (
              <div className="activity-item" key={invitee.id}>
                <Avatar seed={invitee.profile.avatarSeed} size="sm" />
                <div><strong>{invitee.firstName} {invitee.lastName}</strong><small>{invitee.group} · {invitee.noteToHost || "עדכון אישור הגעה"}</small></div>
                <StatusPill status={invitee.status} />
              </div>
            )) : <div className="empty-state">עדיין אין תגובות.</div>}
          </div>
          <div className="progress-wrap" style={{ marginTop: 20 }}><div className="progress-meta"><span>שיעור תגובה</span><strong>{responseRate}%</strong></div><div className="progress"><span style={{ width: `${responseRate}%` }} /></div></div>
        </div>

        <div className="card event-mini">
          <div className="event-mini-art"><p>האירוע הקרוב</p><h3>{event.title}</h3><p>{event.subtitle}</p></div>
          <div className="event-mini-body">
            <div className="info-row"><CalendarIcon />{formatEventDate(event.startsAt)} · {formatTime(event.startsAt)}</div>
            <div className="info-row"><LocationIcon />{event.locationName}, {event.locationAddress}</div>
            <Link className="btn btn-dark" href={`/e/${event.slug}/attendees`}>עמוד המשתתפים</Link>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
