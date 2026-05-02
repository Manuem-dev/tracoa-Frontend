"use React";

export type TracaoBadgeType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface TracaoBadgeProps {
  label: string;
  type?: TracaoBadgeType;
}

export function TracaoBadge({ label, type = 'neutral' }: TracaoBadgeProps) {
  let bgClass = '';
  let textClass = '';

  switch (type) {
    case 'success':
      bgClass = 'bg-tracao-forest-light';
      textClass = 'text-tracao-forest';
      break;
    case 'warning':
      bgClass = 'bg-tracao-gold';
      textClass = 'text-tracao-choco';
      break;
    case 'error':
      bgClass = 'bg-tracao-error-light';
      textClass = 'text-tracao-error';
      break;
    case 'info':
      bgClass = 'bg-tracao-rust-light';
      textClass = 'text-tracao-cacao';
      break;
    case 'neutral':
      bgClass = 'bg-tracao-cream-mid';
      textClass = 'text-tracao-choco-mid';
      break;
  }

  return (
    <div className={`px-2.5 py-1 rounded-md inline-block ${bgClass}`}>
      <span className={`text-[11px] font-bold ${textClass}`}>
        {label}
      </span>
    </div>
  );
}
