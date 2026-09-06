import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { FieldShell } from "./FieldShell";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
  short?: boolean | undefined;
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
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { hasError, describedBy, short = false, label, helperText, className = "", id, ...props },
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
        <textarea
          ref={ref}
          id={fieldId}
          className={`af-control ${short ? "af-control--textarea-short" : "af-control--textarea"} ${className}`}
          aria-invalid={hasError || undefined}
          aria-describedby={[describedBy, helpId].filter(Boolean).join(" ") || undefined}
          {...props}
        />
      </FieldShell>
    );
  },
);

TextArea.displayName = "TextArea";
