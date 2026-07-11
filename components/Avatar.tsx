export function Avatar({ seed, size = "md" }: { seed: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar-${size}`}>{seed.slice(0, 2).toUpperCase()}</span>;
}
