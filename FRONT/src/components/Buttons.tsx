import React from "react"
import { Link } from "react-router-dom"

type Variant = "primary" | "secondary" | "danger" | "ghost"

type CommonProps = {
  children: React.ReactNode
  variant?: Variant
  className?: string
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

type ButtonAsButton = CommonProps & {
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  to?: undefined
}

type ButtonAsLink = CommonProps & {
  to: string // si 'to' est fourni => rend un <Link>
  type?: undefined
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

type Props = ButtonAsButton | ButtonAsLink

const base =
  "inline-flex items-center justify-center px-4 py-2 text-base rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition"
const byVariant: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
}

export default function Button(props: Props) {
  const {
    children,
    variant = "primary",
    className = "",
    disabled,
    loading,
    ariaLabel,
  } = props

  const classes = [
    base,
    byVariant[variant],
    disabled || loading ? "opacity-60 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  if ("to" in props && props.to) {
    // 🔗 Rend un <Link> avec onClick optionnel
    return (
      <Link
        to={props.to}
        onClick={props.onClick}            
        aria-label={ariaLabel}
        className={classes}
        aria-busy={loading || undefined}
      >
        {children}
      </Link>
    )
  }

  const { type = "button", onClick } = props as ButtonAsButton
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={classes}
    >
      {children}
    </button>
  )
}
