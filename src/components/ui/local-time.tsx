"use client";

interface LocalTimeProps {
  iso: string;
  format?: "date" | "datetime";
}

const OPTIONS = {
  date: { dateStyle: "medium" },
  datetime: { dateStyle: "medium", timeStyle: "short" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

export function LocalTime({ iso, format = "datetime" }: LocalTimeProps) {
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {new Intl.DateTimeFormat("en", OPTIONS[format]).format(new Date(iso))}
    </time>
  );
}
