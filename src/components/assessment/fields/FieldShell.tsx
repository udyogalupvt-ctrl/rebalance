import type { ReactNode } from "react";

/**
 * Wraps a control with its label and helper text when they are supplied.
 * When no label is given it renders the control alone, so the assessment
 * steps (which supply their own labels via FormField) are unaffected.
 */
export function FieldShell({
  fieldId,
  label,
  helperText,
  helpId,
  required,
  children,
}: {
  fieldId: string;
  label?: string | undefined;
  helperText?: string | undefined;
  helpId?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  if (!label && !helperText) return <>{children}</>;

  return (
    <div className="af-field">
      {label && (
        <label className="af-label" htmlFor={fieldId}>
          {label}
          {required && (
            <span className="af-label__required" aria-hidden="true">
              {" *"}
            </span>
          )}
        </label>
      )}
      {children}
      {helperText && (
        <p className="af-helper" id={helpId}>
          {helperText}
        </p>
      )}
    </div>
  );
}
