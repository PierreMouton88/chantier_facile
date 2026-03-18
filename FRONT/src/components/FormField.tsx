interface FieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export default function Field({ label, children, className = "" }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </span>
      {children}
    </label>
  )
}