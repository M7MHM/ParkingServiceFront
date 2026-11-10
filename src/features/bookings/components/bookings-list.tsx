import { getMyBookings } from "../api/bookings.service";
import { BookingsView } from "./bookings-view";

export async function BookingsList() {
  const bookings = await getMyBookings();
  return <BookingsView bookings={bookings} />;
}

export function BookingsListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading bookings" className="animate-pulse space-y-5">
      <div className="h-12 rounded-xl bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((key) => (
          <div key={key} className="h-48 rounded-2xl border border-slate-200 bg-white" />
        ))}
      </div>
    </div>
  );
}
