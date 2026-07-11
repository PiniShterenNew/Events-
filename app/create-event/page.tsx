import Link from "next/link";
import { CalendarIcon, LocationIcon, SparkIcon } from "@/components/Icons";

export default function CreateEventPage() {
  return (
    <main className="create-page">
      <nav className="landing-nav">
        <Link className="public-brand" href="/"><span className="brand-mark"><SparkIcon /></span><span>Gatherly</span></Link>
        <Link className="btn btn-secondary" href="/admin">לניהול הדמו</Link>
      </nav>

      <section className="create-shell">
        <div className="create-intro">
          <p className="eyebrow">יצירת אירוע</p>
          <h1 className="page-title">ספרו לנו מה חוגגים — ונבנה לכם עמוד הזמנה.</h1>
          <p className="page-subtitle">הטופס מעדכן את אירוע הדמו ושולח אתכם ישירות למרכז הניהול כדי להמשיך להוסיף מוזמנים והודעות.</p>
          <div className="create-preview card">
            <span><CalendarIcon /></span>
            <strong>זרימה מומלצת</strong>
            <p>פרטי אירוע → עמוד ציבורי → ניהול מוזמנים → שליחת הזמנות.</p>
          </div>
        </div>

        <form className="card form-card create-form" action="/api/events" method="post">
          <h2>פרטי האירוע</h2>
          <p>אפשר לערוך אחר כך מתוך לוח הניהול.</p>
          <label className="label">שם האירוע<input className="input" name="title" placeholder="לדוגמה: חתונת דנה ויואב" required /></label>
          <label className="label">תיאור קצר<textarea className="textarea" name="description" placeholder="מה האורחים צריכים לדעת?" required /></label>
          <div className="field-grid">
            <label className="label">תאריך ושעה<input className="input" name="startsAt" type="datetime-local" required /></label>
            <label className="label">שם המארח<input className="input" name="hostName" placeholder="שם מארח/ת" required /></label>
          </div>
          <div className="field-grid">
            <label className="label">שם המקום<input className="input" name="locationName" placeholder="אולם / בית / חוף" required /></label>
            <label className="label">כתובת<input className="input" name="locationAddress" placeholder="רחוב, עיר" required /></label>
          </div>
          <label className="label">קוד לבוש<input className="input" name="dressCode" placeholder="חגיגי, קז׳ואל, לבן..." /></label>
          <button className="btn btn-primary" type="submit"><LocationIcon /> יצירת אירוע ומעבר לניהול</button>
        </form>
      </section>
    </main>
  );
}
