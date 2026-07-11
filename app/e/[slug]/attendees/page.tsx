import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { ExternalIcon, SparkIcon } from "@/components/Icons";
import { getEvent, getPublicAttendees } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AttendeesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent();
  if (event.slug !== slug || !event.attendeeDirectoryEnabled) notFound();
  const attendees = getPublicAttendees();
  return <div className="attendees-page"><nav className="public-nav"><Link href={`/e/${event.slug}`} className="public-brand"><span className="brand-mark"><SparkIcon /></span>Gatherly</Link><Link className="btn btn-secondary" href={`/e/${event.slug}`}>חזרה לאירוע</Link></nav><header className="attendees-header"><p className="eyebrow">הקהילה של הערב</p><h1>מי מגיע לחגוג?</h1><p>רק מוזמנים שבחרו במפורש להופיע כאן מוצגים בעמוד. כל אחד מחליט אילו פרטים לשתף.</p></header><main className="attendees-grid">{attendees.length ? attendees.map((attendee) => { const p = attendee.profile; return <article className="card attendee-card" key={attendee.id}><Avatar seed={p.avatarSeed} size="lg" /><h2>{p.displayName || attendee.firstName}</h2>{p.showOccupation && p.occupation && <div className="occupation">{p.occupation}{p.city ? ` · ${p.city}` : ""}</div>}<p className="bio">{p.bio || "מגיע/ה לחגוג ולהכיר אנשים טובים."}</p>{p.showInterests && p.interests.length > 0 && <div className="chips">{p.interests.map((interest) => <span className="chip" key={interest}>{interest}</span>)}</div>}{p.showInstagram && p.instagramUsername && <a className="instagram-link" href={`https://instagram.com/${p.instagramUsername}`} target="_blank" rel="noreferrer">@{p.instagramUsername}<ExternalIcon width={14} /></a>}</article>; }) : <div className="card empty-state" style={{ gridColumn: "1 / -1" }}>עדיין אין משתתפים שבחרו להופיע בפומבי.</div>}</main></div>;
}
