export function SourceNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mt-4 text-xs tracking-wide text-faint ${className}`}>
      <span className="uppercase">Source</span> · {children}
    </p>
  );
}
