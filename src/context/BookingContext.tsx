import * as React from "react";
import { BookingDialog } from "@/components/shared/BookingDialog";

type OpenOptions = { source?: string; concern?: string };

type BookingContextValue = {
  openBooking: (options?: OpenOptions) => void;
  closeBooking: () => void;
  isBookingOpen: boolean;
};

const BookingContext = React.createContext<BookingContextValue | null>(null);

/**
 * One booking dialog for the whole site.
 *
 * Every "Book Consultation" button across the marketing pages opens this same
 * instance rather than mounting its own copy: a modal per call site means the
 * partial-capture lead id resets whenever a different button is used, and two
 * dialogs can end up in the DOM at once during a route transition.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<OpenOptions>({});

  const openBooking = React.useCallback((next: OpenOptions = {}) => {
    setOptions(next);
    setOpen(true);
  }, []);

  const closeBooking = React.useCallback(() => setOpen(false), []);

  const value = React.useMemo(
    () => ({ openBooking, closeBooking, isBookingOpen: open }),
    [openBooking, closeBooking, open],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog
        open={open}
        onOpenChange={setOpen}
        source={options.source ?? "booking-dialog"}
        {...(options.concern ? { presetConcern: options.concern } : {})}
      />
    </BookingContext.Provider>
  );
}

/**
 * Returns a no-op opener when there is no provider above, so a component can
 * render a Book button without every test and every admin route needing the
 * marketing provider mounted.
 */
export function useBooking(): BookingContextValue {
  const ctx = React.useContext(BookingContext);
  return (
    ctx ?? {
      openBooking: () => {},
      closeBooking: () => {},
      isBookingOpen: false,
    }
  );
}
