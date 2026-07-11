import Link from "next/link";
import { AuthPanel } from "@/components/AuthPanel";
import { ArrowIcon, CalendarIcon, CheckIcon, MessageIcon, SparkIcon, UsersIcon } from "@/components/Icons";

const features = [
  { icon: <CalendarIcon />, title: "בונים אירוע בדקות", text: "שם, תאריך, מיקום, דדליין ואווירה — הכל במקום אחד." },
  { icon: <UsersIcon />, title: "ניהול מוזמנים חכם", text: "סטטוסים, קבוצות, פלוס־אחד ופרופילים ציבוריים למינגלינג." },
  { icon: <MessageIcon />, title: "תקשורת חלקה", text: "הודעות ותזכורות למי שעדיין לא ענה, עם תצוגה מקדימה ברורה." },
];

export default async function Home({ searchParams }: { searchParams?: Promise<{ auth?: string; mode?: string }> }) {
  const params = await searchParams;

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

        <AuthPanel mode={params?.mode} message={params?.auth} />
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
