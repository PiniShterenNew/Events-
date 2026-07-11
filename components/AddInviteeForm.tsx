"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/components/Icons";

export function AddInviteeForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/invitees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error ?? "לא ניתן להוסיף את המוזמן");
      return;
    }
    event.currentTarget.reset();
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}><PlusIcon />הוספת מוזמן</button>;
  }

  return (
    <div className="card form-card" style={{ marginBottom: 18 }}>
      <div className="panel-head">
        <div><h2>מוזמן חדש</h2><p className="muted" style={{ margin: "5px 0 0" }}>המערכת תיצור קישור הזמנה אישי אוטומטית.</p></div>
        <button className="btn btn-ghost" type="button" onClick={() => setOpen(false)}>סגירה</button>
      </div>
      <form onSubmit={submit}>
        <div className="field-grid">
          <label className="label">שם פרטי<input className="input" name="firstName" required /></label>
          <label className="label">שם משפחה<input className="input" name="lastName" required /></label>
          <label className="label">טלפון<input className="input" name="phone" required /></label>
          <label className="label">אימייל<input className="input" name="email" type="email" /></label>
          <label className="label">קבוצה<select className="select" name="group" defaultValue="חברים"><option>חברים</option><option>משפחה</option><option>עבודה</option><option>אחר</option></select></label>
          <label className="label">מקסימום משתתפים<input className="input" name="maxGuests" type="number" min="1" max="10" defaultValue="1" /></label>
        </div>
        {error && <p style={{ color: "var(--red)" }}>{error}</p>}
        <div className="form-actions"><button className="btn btn-primary" disabled={loading}>{loading ? "מוסיף..." : "יצירת הזמנה"}</button></div>
      </form>
    </div>
  );
}
