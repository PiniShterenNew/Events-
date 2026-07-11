import { statusLabels } from "@/lib/format";
import type { RSVPStatus } from "@/types";

export function StatusPill({ status }: { status: RSVPStatus }) {
  return <span className={`status-pill status-${status}`}>{statusLabels[status]}</span>;
}
