import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean | undefined;
  helper?: string | undefined;
  error?: string | undefined;
  errorId?: string | undefined;
  helperId?: string | undefined;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  helper,
  error,
  errorId,
  helperId,
  children,
}: FormFieldProps) {
  return (
    <div className="af-field">
      <label className="af-label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="af-label__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {helper && !error && (
        <p className="af-helper" id={helperId}>
          {helper}
        </p>
      )}
      {error && (
        <p className="af-error" id={errorId} role="alert">
          <AlertCircle aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
