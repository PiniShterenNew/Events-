"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Invitee, RSVPStatus } from "@/types";
import { CheckIcon, ShareIcon } from "@/components/Icons";

export function RSVPForm({ invitee }: { invitee: Invitee }) {
  const router = useRouter();
  const [status, setStatus] = useState<RSVPStatus>(invitee.status);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSaved(false);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      status,
      guestCount: Number(form.get("guestCount") ?? 1),
      guestNames: String(form.get("guestNames") ?? ""),
      dietaryNotes: String(form.get("dietaryNotes") ?? ""),
      noteToHost: String(form.get("noteToHost") ?? ""),
      profile: {
        isPublic: form.get("isPublic") === "on",
        displayName: String(form.get("displayName") ?? invitee.firstName),
        occupation: String(form.get("occupation") ?? ""),
        interests: String(form.get("interests") ?? "").split(",").map((x) => x.trim()).filter(Boolean),
        city: String(form.get("city") ?? ""),
        instagramUsername: String(form.get("instagramUsername") ?? "").replace(/^@/, ""),
        bio: String(form.get("bio") ?? ""),
        showOccupation: form.get("showOccupation") === "on",
        showInterests: form.get("showInterests") === "on",
        showInstagram: form.get("showInstagram") === "on",
      },
    };
    const response = await fetch(`/api/rsvp/${invitee.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error ?? "לא ניתן לשמור");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  async function share() {
    const shareData = {
      title: "יום ההולדת של פנחס",
      text: "אני מגיע/ה ליום ההולדת של פנחס — נתראה שם!",
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(shareData);
    else await navigator.clipboard.writeText(window.location.href);
  }

  const p = invitee.profile;
  return (
    <form onSubmit={submit}>
      {saved && <div className="success-box"><CheckIcon /><div><strong>התגובה נשמרה</strong><p>אפשר לחזור לקישור ולעדכן את הפרטים בכל שלב.</p></div></div>}
      <h2 className="rsvp-title">האם תגיעו?</h2>
      <p className="muted" style={{ marginTop: 0 }}>בחרו תשובה ועדכנו את הפרטים הרלוונטיים.</p>
      <div className="rsvp-options">
        <label className="rsvp-option"><input type="radio" checked={status === "going"} onChange={() => setStatus("going")} /><span>כן, מגיע/ה<small>מחכה לזה</small></span></label>
        <label className="rsvp-option"><input type="radio" checked={status === "maybe"} onChange={() => setStatus("maybe")} /><span>אולי<small>אעדכן בהמשך</small></span></label>
        <label className="rsvp-option"><input type="radio" checked={status === "declined"} onChange={() => setStatus("declined")} /><span>לא הפעם<small>ניפגש בשמחה אחרת</small></span></label>
      </div>

      {status === "going" && (
        <div className="field-grid">
          <label className="label">כמה מגיעים?<select className="select" name="guestCount" defaultValue={invitee.guestCount || 1}>{Array.from({ length: invitee.maxGuests }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></label>
          <label className="label">שמות אורחים נוספים<input className="input" name="guestNames" defaultValue={invitee.guestNames} placeholder="אופציונלי" /></label>
          <label className="label">העדפות או רגישויות אוכל<input className="input" name="dietaryNotes" defaultValue={invitee.dietaryNotes} placeholder="צמחוני, טבעוני, אלרגיות..." /></label>
          <label className="label">הודעה למארח<input className="input" name="noteToHost" defaultValue={invitee.noteToHost} placeholder="אופציונלי" /></label>
        </div>
      )}

      <section className="form-section">
        <h3>להופיע בעמוד המשתתפים?</h3>
        <p className="muted">הבחירה היא שלך. ניתן לפרסם רק את הפרטים שתרצה לשתף.</p>
        <div className="toggle-row">
          <div><strong>פרופיל ציבורי באירוע</strong><p>משתתפים אחרים יוכלו לראות שבחרת להגיע.</p></div>
          <label className="switch"><input type="checkbox" name="isPublic" defaultChecked={p.isPublic} /><span className="switch-slider" /></label>
        </div>
        <div className="field-grid" style={{ marginTop: 18 }}>
          <label className="label">שם להצגה<input className="input" name="displayName" defaultValue={p.displayName || invitee.firstName} /></label>
          <label className="label">עיסוק<input className="input" name="occupation" defaultValue={p.occupation} /></label>
          <label className="label">תחומי עניין<input className="input" name="interests" defaultValue={p.interests.join(", ")} placeholder="עיצוב, מוזיקה, יזמות" /></label>
          <label className="label">עיר<input className="input" name="city" defaultValue={p.city} /></label>
          <label className="label">אינסטגרם<input className="input" name="instagramUsername" defaultValue={p.instagramUsername} placeholder="username" /></label>
          <label className="label">משפט קצר<input className="input" name="bio" defaultValue={p.bio} /></label>
        </div>
        <div className="toggle-row"><div><strong>הצגת עיסוק</strong></div><label className="switch"><input type="checkbox" name="showOccupation" defaultChecked={p.showOccupation} /><span className="switch-slider" /></label></div>
        <div className="toggle-row"><div><strong>הצגת תחומי עניין</strong></div><label className="switch"><input type="checkbox" name="showInterests" defaultChecked={p.showInterests} /><span className="switch-slider" /></label></div>
        <div className="toggle-row"><div><strong>הצגת אינסטגרם</strong></div><label className="switch"><input type="checkbox" name="showInstagram" defaultChecked={p.showInstagram} /><span className="switch-slider" /></label></div>
      </section>

      {error && <p style={{ color: "var(--red)" }}>{error}</p>}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={loading}>{loading ? "שומר..." : "שמירת התשובה"}</button>
        {invitee.status === "going" && <button type="button" className="btn btn-secondary" onClick={share}><ShareIcon />שיתוף</button>}
      </div>
    </form>
  );
}
