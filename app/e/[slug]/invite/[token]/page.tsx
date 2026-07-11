import Link from "next/link";
import { notFound } from "next/navigation";
import { RSVPForm } from "@/components/RSVPForm";
import { CalendarIcon, LocationIcon, SparkIcon, UsersIcon } from "@/components/Icons";
import { formatEventDate, formatTime } from "@/lib/format";
import { getEvent, getInviteeByToken } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params;
  const event = getEvent();
  const invitee = getInviteeByToken(token);
  if (!invitee || event.slug !== slug) notFound();

  return <div className="invite-page"><div className="invite-shell"><div className="invite-top"><Link href={`/e/${event.slug}`} className="public-brand"><span className="brand-mark"><SparkIcon /></span>Gatherly</Link><Link href={`/e/${event.slug}/attendees`} className="btn btn-secondary"><UsersIcon />מי מגיע</Link></div>
    <article className="card invite-card"><header className="invite-banner"><span className="tiny">הזמנה אישית עבור {invitee.firstName}</span><h1>{event.title}</h1><p>{event.subtitle}</p></header><div className="invite-content">
      <div className="invite-details"><div className="invite-detail"><small>תאריך</small><strong>{formatEventDate(event.startsAt)}</strong></div><div className="invite-detail"><small>שעה</small><strong>{formatTime(event.startsAt)}</strong></div><div className="invite-detail"><small>מיקום</small><strong>{event.locationName}</strong></div></div>
      <RSVPForm invitee={invitee} />
      <div className="form-section"><div className="info-row"><CalendarIcon />ניתן לעדכן תשובה עד {formatEventDate(event.rsvpDeadline)}</div><div className="info-row" style={{ marginTop: 9 }}><LocationIcon />{event.locationAddress}</div></div>
    </div></article>
  </div></div>;
}
