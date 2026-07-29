'use client';

import Link from 'next/link';
import {
  Bell,
  ClipboardList,
  FilePlus2,
  Flag,
  LayoutDashboard,
  Map,
  Menu,
  UserRound,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SessionExpiryGuard } from '@/components/auth/SessionExpiryGuard';
import { SignOutButton } from '@/components/auth/SignOutButton';
import type { UserRole } from '@/types/database';

const citizenNavigation = [
  { href: '/citizen', label: 'Përmbledhja', icon: LayoutDashboard, exact: true },
  { href: '/citizen/reports', label: 'Raportimet', icon: FilePlus2, exact: false },
  { href: '/citizen/report', label: 'Raporto', icon: Map, exact: false },
  { href: '/notifications', label: 'Njoftimet', icon: Bell, exact: false },
  { href: '/account', label: 'Llogaria', icon: UserRound, exact: false },
];

const staffNavigation = [
  { href: '/official', label: 'Përmbledhja', icon: LayoutDashboard, exact: true },
  { href: '/official/reports', label: 'Inbox-i zyrtar', icon: ClipboardList, exact: false },
  { href: '/notifications', label: 'Njoftimet', icon: Bell, exact: false },
  { href: '/account', label: 'Llogaria', icon: UserRound, exact: false },
];

export function WorkspaceHeader({
  role = 'citizen',
  unreadCount = 0,
}: {
  role?: UserRole;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const isStaff = role === 'official' || role === 'admin';
  const navigation = isStaff ? staffNavigation : citizenNavigation;
  const homeHref = isStaff ? '/official' : '/citizen';

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <SessionExpiryGuard />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={homeHref}
          className="flex items-center gap-3"
          aria-label={isStaff ? 'Hap inbox-in zyrtar' : 'Hap panelin qytetar'}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Flag className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-tight text-slate-950">
              Raporto Qytetin
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {isStaff ? 'Hapësira zyrtare' : 'Hapësira qytetare'}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label={isStaff ? 'Navigimi i hapësirës zyrtare' : 'Navigimi i hapësirës qytetare'}
        >
          {navigation.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'inline-flex h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {href === '/notifications' && unreadCount > 0 ? (
                  <NotificationCount count={unreadCount} />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <SignOutButton />
          </div>
          <details className="relative lg:hidden">
            <summary className="relative flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Hap menynë</span>
              {unreadCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600" />
              ) : null}
            </summary>
            <nav
              className="absolute right-0 top-14 z-20 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.38)]"
              aria-label="Navigimi mobile"
            >
              {navigation.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold',
                      active
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {href === '/notifications' && unreadCount > 0 ? (
                      <NotificationCount count={unreadCount} />
                    ) : null}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-slate-100 pt-2">
                <SignOutButton />
              </div>
            </nav>
          </details>
        </div>
        </div>
      </header>
    </>
  );
}

function NotificationCount({ count }: { count: number }) {
  return (
    <span className="flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}
