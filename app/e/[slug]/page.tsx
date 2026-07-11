import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon, ExternalIcon, LocationIcon, SparkIcon, UsersIcon } from "@/components/Icons";
import { formatEventDate, formatTime } from "@/lib/format";
import { getEvent, getInvitees } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent();
  if (event.slug !== slug) notFound();
  const invitees = getInvitees();
  const publicCount = invitees.filter((i) => i.status === "going" && i.profile.isPublic).length;
  const sample = invitees[0];

  return <div className="public-page">
    <nav className="public-nav"><Link href={`/e/${event.slug}`} className="public-brand"><span className="brand-mark"><SparkIcon /></span>Gatherly</Link><div className="public-nav-links"><Link href={`/e/${event.slug}/attendees`}>מי מגיע</Link><Link href="/admin">כניסת מארגן</Link><Link className="btn btn-primary" href={`/e/${event.slug}/invite/${sample.token}`}>הזמנה לדוגמה</Link></div></nav>
    <main>
      <section className="public-hero"><div className="hero-art"><div className="hero-content"><span className="hero-kicker">הזמנה אישית · {formatEventDate(event.startsAt)}</span><h1>{event.title}</h1><p>{event.description}</p><div className="hero-actions"><Link className="btn btn-primary" href={`/e/${event.slug}/invite/${sample.token}`}>אישור הגעה</Link><Link className="btn btn-secondary" href={`/e/${event.slug}/attendees`}><UsersIcon />מי כבר מגיע</Link></div></div></div></section>
      <section className="public-info"><div className="info-grid">
        <div className="card info-card"><span className="info-card-icon"><CalendarIcon /></span><div><strong>מתי?</strong><p>{formatEventDate(event.startsAt)}<br />בשעה {formatTime(event.startsAt)}</p></div></div>
        <div className="card info-card"><span className="info-card-icon"><LocationIcon /></span><div><strong>איפה?</strong><p>{event.locationName}<br />{event.locationAddress}</p></div></div>
        <div className="card info-card"><span className="info-card-icon"><UsersIcon /></span><div><strong>אנשים טובים</strong><p>{publicCount} משתתפים בחרו להציג את עצמם בעמוד הציבורי.</p></div></div>
      </div></section>
      <section className="story-section"><p className="eyebrow">מה מחכה לנו</p><h2>{event.subtitle}</h2><p>ערב לא רשמי, בלי טקסים מיותרים. אוכל, מוזיקה והזדמנות להיפגש. קוד הלבוש: {event.dressCode}.</p><a className="btn btn-dark" href={event.navigationUrl} target="_blank" rel="noreferrer"><ExternalIcon />פתיחה ב־Waze</a></section>
    </main>
  </div>;
}
