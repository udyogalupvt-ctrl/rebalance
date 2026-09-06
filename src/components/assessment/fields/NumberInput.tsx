import { forwardRef, type InputHTMLAttributes } from "react";

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean | undefined;
  describedBy?: string | undefined;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ hasError, describedBy, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="number"
        inputMode="numeric"
        className={`af-control ${className}`}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy || undefined}
        {...props}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";
