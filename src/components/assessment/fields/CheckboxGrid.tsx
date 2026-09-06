interface CheckboxGridOption {
  value: string;
  label: string;
}

interface CheckboxGridProps {
  options: CheckboxGridOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function CheckboxGrid({ options, value, onChange }: CheckboxGridProps) {
  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className="af-checkbox-grid">
      {options.map((opt) => {
        const isChecked = value.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={`af-checkbox-item${isChecked ? " af-checkbox-item--checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggle(opt.value)}
              className="af-sr-only"
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <rect
                x="1"
                y="1"
                width="16"
                height="16"
                rx="4"
                stroke={isChecked ? "var(--primary)" : "var(--border)"}
                strokeWidth="1.5"
                fill={isChecked ? "var(--primary)" : "transparent"}
              />
              {isChecked && (
                <path
                  d="M5.5 9L7.5 11L12.5 6.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
