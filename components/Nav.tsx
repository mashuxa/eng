'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Home' },
  { href: '/topics', label: 'Topics' },
  { href: '/plan', label: 'Plan' },
  { href: '/vocabulary', label: 'Vocabulary' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav>
      <h1>🇬🇧 Eng</h1>
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={'tab' + (pathname === t.href ? ' active' : '')}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
