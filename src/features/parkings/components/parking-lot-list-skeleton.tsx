export function ParkingLotListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul aria-busy="true" aria-label="Loading parking lots" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
          <div className="mt-5 h-3 w-1/2 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
          <div className="mt-6 h-6 w-full rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}
