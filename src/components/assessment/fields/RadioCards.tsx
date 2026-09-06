import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface RadioCardOption {
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface RadioCardsProps {
  name: string;
  options: RadioCardOption[];
  value?: string | undefined;
  onChange: (value: string) => void;
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
}

export function RadioCards({
  name,
  options,
  value,
  onChange,
  hasError,
  describedBy,
}: RadioCardsProps) {
  return (
    <div
      className="af-radio-cards"
      role="radiogroup"
      aria-invalid={hasError || undefined}
      aria-describedby={describedBy || undefined}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const Icon = opt.icon;

        return (
          <label
            key={opt.value}
            className={`af-radio-card${isSelected ? " af-radio-card--selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange(opt.value)}
              className="af-sr-only"
            />
            <Icon className="af-radio-card__icon" aria-hidden="true" />
            <div className="af-radio-card__content">
              <div className="af-radio-card__title">{opt.title}</div>
              <div className="af-radio-card__description">{opt.description}</div>
            </div>
            <span className="af-radio-card__indicator" aria-hidden="true">
              <span className="af-radio-card__indicator-dot" />
            </span>
          </label>
        );
      })}
    </div>
  );
}
