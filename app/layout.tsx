import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import { ProgressProvider } from '@/lib/progress-context';

export const metadata: Metadata = {
  title: 'Eng',
  description: 'Workplace English B1 → B2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ProgressProvider>
          <div className="app">
            <Nav />
            <main>{children}</main>
          </div>
        </ProgressProvider>
      </body>
    </html>
  );
}
