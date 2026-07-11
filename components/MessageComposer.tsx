"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Invitee } from "@/types";
import { Avatar } from "@/components/Avatar";
import { MessageIcon } from "@/components/Icons";

const audienceLabels = { all: "כל המוזמנים", pending: "טרם ענו", going: "אישרו הגעה", maybe: "אולי" };

export function MessageComposer({ invitees }: { invitees: Invitee[] }) {
  const router = useRouter();
  const [audience, setAudience] = useState<keyof typeof audienceLabels>("pending");
  const [content, setContent] = useState("היי {{firstName}}, תזכורת קטנה לאשר הגעה ליום ההולדת. כל הפרטים מחכים לך בקישור האישי.");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const recipientCount = useMemo(() => audience === "all" ? invitees.length : invitees.filter((i) => i.status === audience).length, [audience, invitees]);
  const sample = invitees.find((i) => audience === "all" || i.status === audience) ?? invitees[0];
  const preview = content.replaceAll("{{firstName}}", sample?.firstName ?? "נועה").replaceAll("{{inviteLink}}", "https://event.co/invite/...");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setSent(false);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience, content }),
    });
    setLoading(false);
    if (response.ok) {
      setSent(true);
      router.refresh();
    }
  }

  return (
    <div className="message-layout">
      <form className="card form-card" onSubmit={submit}>
        <h2>הודעה חדשה</h2>
        <p>השליחה כרגע מדומה ונרשמת ביומן המערכת.</p>
        <label className="label">קהל יעד<select className="select" value={audience} onChange={(e) => setAudience(e.target.value as keyof typeof audienceLabels)}>{Object.entries(audienceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <p className="muted" style={{ fontSize: 13 }}>ההודעה מיועדת ל־<strong>{recipientCount}</strong> נמענים.</p>
        <label className="label">תוכן ההודעה<textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} /></label>
        <p className="muted" style={{ fontSize: 12 }}>משתנים נתמכים: {"{{firstName}}"}, {"{{inviteLink}}"}</p>
        {sent && <div className="success-box"><MessageIcon /><div><strong>ההודעה נשמרה בהצלחה</strong><p>בגרסת Production היא תועבר לספק WhatsApp, SMS או אימייל.</p></div></div>}
        <div className="form-actions"><button className="btn btn-primary" disabled={loading || recipientCount === 0}>{loading ? "שומר..." : `הדמיית שליחה ל־${recipientCount}`}</button></div>
      </form>
      <div className="card form-card">
        <h2>תצוגה מקדימה</h2><p>כך ההודעה תיראה בטלפון של המוזמן.</p>
        <div className="preview-phone">
          <div className="preview-screen">
            <div className="preview-bar"><Avatar seed={sample?.profile.avatarSeed ?? "GS"} size="sm" /><div><strong>פנחס — יום הולדת</strong><div style={{ fontSize: 11, opacity: .72 }}>מחובר</div></div></div>
            <div className="preview-bubble">{preview}<div style={{ textAlign: "left", color: "#718079", fontSize: 10, marginTop: 4 }}>17:42 ✓✓</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
