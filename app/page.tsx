import Link from "next/link";
import { ArrowIcon, CalendarIcon, CheckIcon, MessageIcon, SparkIcon, UsersIcon } from "@/components/Icons";

const features = [
  { icon: <CalendarIcon />, title: "בונים אירוע בדקות", text: "שם, תאריך, מיקום, דדליין ואווירה — הכל במקום אחד." },
  { icon: <UsersIcon />, title: "ניהול מוזמנים חכם", text: "סטטוסים, קבוצות, פלוס־אחד ופרופילים ציבוריים למינגלינג." },
  { icon: <MessageIcon />, title: "תקשורת חלקה", text: "הודעות ותזכורות למי שעדיין לא ענה, עם תצוגה מקדימה ברורה." },
];

export default function Home() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="public-brand" href="/">
          <span className="brand-mark"><SparkIcon /></span>
          <span>Gatherly</span>
        </Link>
        <div className="landing-nav-actions">
          <a href="#auth">כניסה</a>
          <Link className="btn btn-primary" href="/create-event">יצירת אירוע</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <p className="hero-kicker">מערכת RSVP מודרנית לאירועים פרטיים</p>
          <h1>הופכים הזמנה לאירוע שנעים לנהל.</h1>
          <p>
            עמוד נחיתה לאורחים, הרשמה וכניסה למארגנים, יצירת אירוע, אישורי הגעה וניהול מוזמנים — בזרימה אחת נקייה בעברית.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/create-event">התחילו ליצור אירוע <ArrowIcon /></Link>
            <Link className="btn btn-secondary" href="/e/pinhas-birthday">צפייה בדמו</Link>
          </div>
          <div className="landing-trust">
            <span><CheckIcon /> ללא התקנה</span>
            <span><CheckIcon /> מותאם למובייל</span>
            <span><CheckIcon /> בעברית מלאה</span>
          </div>
        </div>

        <form className="auth-card card" id="auth">
          <div className="auth-tabs" aria-label="בחירת פעולה">
            <input defaultChecked id="login" name="authMode" type="radio" />
            <label htmlFor="login">כניסה</label>
            <input id="signup" name="authMode" type="radio" />
            <label htmlFor="signup">הרשמה</label>
          </div>
          <h2>ברוכים הבאים</h2>
          <p>התחברו עם מייל וסיסמה כדי לנהל אירועים ומוזמנים.</p>
          <label className="label">מייל<input className="input" name="email" placeholder="you@example.com" type="email" required /></label>
          <label className="label">סיסמה<input className="input" name="password" placeholder="לפחות 8 תווים" type="password" minLength={8} required /></label>
          <button className="btn btn-dark" type="submit">המשך למערכת</button>
          <small>דמו חזיתי: לאחר חיבור אמיתי ניתן לחבר ספק Auth ולשמור משתמשים.</small>
        </form>
      </section>

      <section className="landing-features" id="features">
        {features.map((feature) => (
          <article className="card feature-card" key={feature.title}>
            <span className="feature-icon">{feature.icon}</span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
