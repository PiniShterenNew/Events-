import { AdminShell } from "@/components/AdminShell";
import { MessageComposer } from "@/components/MessageComposer";
import { getInvitees, getMessages } from "@/lib/db";

export const dynamic = "force-dynamic";

const audienceLabels: Record<string, string> = { all: "כולם", pending: "טרם ענו", going: "אישרו", maybe: "אולי" };

export default function MessagesPage() {
  const invitees = getInvitees();
  const messages = getMessages();
  return (
    <AdminShell active="/admin/messages">
      <header className="admin-header"><div><p className="eyebrow">תקשורת</p><h1 className="page-title">הודעות ותזכורות</h1><p className="page-subtitle">בחר קהל, כתוב הודעה אישית ובדוק בדיוק לכמה אנשים היא מיועדת.</p></div></header>
      <MessageComposer invitees={invitees} />
      <div className="card panel message-history"><div className="panel-head"><h2>יומן הודעות</h2><span className="muted">מצב הדמיה</span></div>{messages.length ? messages.map((message) => <div className="message-record" key={message.id}><div><p>{message.content}</p><small>{audienceLabels[message.audience]} · {new Date(message.createdAt).toLocaleString("he-IL")}</small></div><strong>{message.recipients} נמענים</strong></div>) : <div className="empty-state">טרם נשמרו הודעות.</div>}</div>
    </AdminShell>
  );
}
