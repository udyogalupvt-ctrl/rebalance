import { forwardRef } from "react";

export type RadioPillOption = {
  value: string;
  label: string;
};

type RadioPillsProps = {
  name: string;
  options: RadioPillOption[];
  value?: string | undefined;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
};

export const RadioPills = forwardRef<HTMLDivElement, RadioPillsProps>(
  ({ name, options, value, onChange, onBlur, hasError, describedBy }, ref) => {
    return (
      <div
        ref={ref}
        className="af-radio-pills"
        role="radiogroup"
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy || undefined}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`af-radio-pill ${isSelected ? "af-radio-pill--selected" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked && onChange) {
                    onChange(opt.value);
                  }
                }}
                onBlur={onBlur}
                className="af-sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    );
  },
);

RadioPills.displayName = "RadioPills";
