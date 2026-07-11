import Link from "next/link";

const authMessages: Record<string, string> = {
  required: "כדי לנהל אירועים צריך להתחבר או להירשם.",
  invalid: "המייל או הסיסמה אינם נכונים.",
  exists: "כבר קיים חשבון עם המייל הזה. נסו להתחבר.",
  "weak-password": "הסיסמה חייבת להכיל לפחות 8 תווים.",
};

export function AuthPanel({ mode, message }: { mode?: string; message?: string }) {
  const isSignup = mode === "signup";

  return (
    <section className="auth-card card" id="auth" aria-labelledby="auth-title">
      <div className="auth-tabs" aria-label="בחירת פעולה">
        <Link className={!isSignup ? "active" : ""} href="/#auth">כניסה</Link>
        <Link className={isSignup ? "active" : ""} href="/?mode=signup#auth">הרשמה</Link>
      </div>
      <h2 id="auth-title">{isSignup ? "יצירת חשבון אמיתי" : "כניסה למערכת"}</h2>
      <p>{isSignup ? "פתחו חשבון מארגן עם מייל וסיסמה מוצפנת, ואז צרו אירוע ראשון." : "התחברו לחשבון המארגן כדי להגיע ללוח הניהול המלא."}</p>
      {message ? <div className="auth-alert" role="status">{authMessages[message] || message}</div> : null}
      <form className="auth-form" action={isSignup ? "/api/auth/register" : "/api/auth/login"} method="post">
        {isSignup ? <label className="label">שם מלא<input className="input" name="name" placeholder="שם המארגן/ת" required /></label> : null}
        <label className="label">מייל<input className="input" name="email" placeholder="you@example.com" type="email" required /></label>
        <label className="label">סיסמה<input className="input" name="password" placeholder="לפחות 8 תווים" type="password" minLength={8} required /></label>
        <button className="btn btn-dark" type="submit">{isSignup ? "הרשמה ויצירת אירוע" : "כניסה ללוח הניהול"}</button>
      </form>
      <small>המערכת שומרת משתמשים מקומיים, מצפינה סיסמאות, ומנהלת Session מאובטח בעוגיית HttpOnly.</small>
    </section>
  );
}
