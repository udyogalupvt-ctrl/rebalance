import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { FieldShell } from "./FieldShell";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
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
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ hasError, describedBy, label, helperText, className = "", id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={fieldId}
          className={`af-control ${className}`}
          aria-invalid={hasError || undefined}
          aria-describedby={[describedBy, helpId].filter(Boolean).join(" ") || undefined}
          {...props}
        />
      </FieldShell>
    );
  },
);

TextInput.displayName = "TextInput";
