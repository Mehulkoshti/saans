interface BadgeProps {
  className: string;
  children: React.ReactNode;
}

export function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${className}`}
    >
      {children}
    </span>
  );
}
