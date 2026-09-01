interface ProgressRingProps {
  /** 0..1 */
  progress: number
  size?: number
  strokeWidth?: number
  /** Renders in the accent colour once the plan is executable. */
  due?: boolean
  label?: string
}

/**
 * Small dial showing how far through its interval a plan is.
 *
 * A bare percentage would be a number the reader has to interpret; a dial is read at a glance,
 * which is the point of showing progress at all. Kept small and unlabelled inside so it reads as
 * an instrument marking rather than a chart.
 */
export function ProgressRing({
  progress,
  size = 38,
  strokeWidth = 2.5,
  due = false,
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(1, Math.max(0, progress))
  const dash = circumference * clamped

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label ?? `${Math.round(clamped * 100)}% through the current interval`}
      className="shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={due ? 'var(--color-accent)' : 'var(--color-ink-soft)'}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 600ms ease, stroke 300ms ease' }}
      />
      {due && (
        <circle cx={size / 2} cy={size / 2} r={strokeWidth * 1.1} fill="var(--color-accent)" />
      )}
    </svg>
  )
}
