export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral"

type StatusBadgeProps = {
  label: string
  variant: BadgeVariant
}

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    neutral: "bg-gray-100 text-gray-800",
  }
  const colorClasses = variantStyles[variant]

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {label}
    </span>
  )
}
