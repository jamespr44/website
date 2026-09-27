export function SourceNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`t-caption mt-5 text-faint ${className}`}>Source · {children}</p>;
}

/** Caption for figures produced by the concept-stage model in `src/lib/estimate.ts`. */
export function EstimateNote({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={`t-caption mt-5 text-faint ${className}`}>
      Indicative · concept-stage estimate{children ? <>. {children}</> : null}
    </p>
  );
}
