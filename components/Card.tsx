interface CardProps {
  as?: "div" | "li";
  className?: string;
  children: React.ReactNode;
}

export function Card({ as: Tag = "div", className = "", children }: CardProps) {
  return (
    <Tag className={`rounded-xl border border-border bg-surface p-4 ${className}`}>
      {children}
    </Tag>
  );
}
