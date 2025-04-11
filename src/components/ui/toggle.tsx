import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  label,
  ...props
}: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-center',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          if (!disabled) {
            onCheckedChange(!checked);
          }
        }}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
          checked ? 'bg-emerald-600' : 'bg-zinc-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        role="presentation"
      >
        <span
          className={cn(
            'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
      {label && <span className="ml-2">{label}</span>}
    </label>
  );
}