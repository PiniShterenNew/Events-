import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gatherly — ניהול הזמנות לאירוע",
  description: "מערכת RSVP, ניהול מוזמנים ושיתוף חברתי לאירועים פרטיים",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
