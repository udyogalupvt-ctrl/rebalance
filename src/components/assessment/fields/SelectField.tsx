import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { FieldShell } from "./FieldShell";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
  options: { value: string; label: string }[];
  placeholder?: string | undefined;
  label?: string | undefined;
  helperText?: string | undefined;
};

/**
 * Optional `label` / `helperText`.
 *
 * The admin pages already passed these, but the components did not declare
 * them, so React spread them onto the DOM node as invalid attributes and no
 * label rendered at all. Rendering a real <label> wired by htmlFor/id fixes
 * both the type error and the missing labels.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      hasError,
      describedBy,
      options,
      placeholder = "Select an option",
      label,
      helperText,
      className = "",
      value,
      id,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const helpId = helperText ? `${fieldId}-help` : undefined;

    return (
      <FieldShell
        fieldId={fieldId}
        label={label}
        helperText={helperText}
        helpId={helpId}
        required={props.required}
      >
        <select
          ref={ref}
          id={fieldId}
          className={`af-control af-control--select ${className}`}
          aria-invalid={hasError || undefined}
          aria-describedby={[describedBy, helpId].filter(Boolean).join(" ") || undefined}
          value={value ?? ""}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  },
);

SelectField.displayName = "SelectField";
