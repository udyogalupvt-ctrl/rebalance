import { forwardRef, type InputHTMLAttributes } from "react";

type PhoneInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ hasError, describedBy, className = "", ...props }, ref) => {
    return (
      <div className="af-phone-wrapper">
        <span className="af-phone-prefix" aria-hidden="true">
          +91
        </span>
        <input
          ref={ref}
          type="tel"
          inputMode="tel"
          className={`af-control ${className}`}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          {...props}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
