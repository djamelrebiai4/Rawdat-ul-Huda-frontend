export function IslamicPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.14">
        {[0, 40, 80, 120, 160].map((x) =>
          [0, 40, 80, 120, 160].map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
              <rect x="12" y="12" width="16" height="16" />
              <circle cx="20" cy="20" r="2.5" />
            </g>
          ))
        )}
      </g>
    </svg>
  );
}