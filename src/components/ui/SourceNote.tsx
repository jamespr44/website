export function SourceNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`t-caption mt-5 text-faint ${className}`}>Source · {children}</p>;
}
