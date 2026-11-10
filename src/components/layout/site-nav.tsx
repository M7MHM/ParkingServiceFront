"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/features/auth/actions/auth.actions";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { buttonStyles } from "@/components/ui/button";

export interface NavLink {
  href: string;
  label: string;
}

interface SiteNavProps {
  links: NavLink[];
  userName: string | null;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ links, userName }: SiteNavProps) {
  const pathname = usePathname();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const open = openForPath === pathname;

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(pathname, href) ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100"
    }`;

  const account = userName ? (
    <form action={logoutAction}>
      <button type="submit" className={buttonStyles({ variant: "secondary", size: "sm", className: "w-full" })}>
        <LogOut aria-hidden="true" className="size-4" />
        Sign out
      </button>
    </form>
  ) : (
    <>
      <Link href={AUTH_ROUTES.LOGIN} className={buttonStyles({ variant: "ghost", size: "sm" })}>
        Sign in
      </Link>
      <Link href={AUTH_ROUTES.REGISTER} className={buttonStyles({ size: "sm" })}>
        Get started
      </Link>
    </>
  );

  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass(link.href)}>
            {link.label}
          </Link>
        ))}
        <span className="mx-2 h-6 w-px bg-slate-200" aria-hidden="true" />
        {userName && <span className="max-w-40 truncate px-2 text-sm text-slate-600">{userName}</span>}
        <div className="flex items-center gap-2">{account}</div>
      </nav>

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpenForPath(open ? null : pathname)}
        className="inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden"
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3 [&>a]:w-full [&>a]:justify-center">
            {userName && <p className="px-3 text-sm text-slate-600">Signed in as {userName}</p>}
            {account}
          </div>
        </nav>
      )}
    </>
  );
}
