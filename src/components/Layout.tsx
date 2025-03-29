import { Outlet } from '@tanstack/react-router';
import { Navigation } from './Navigation';

const Footer = () => (
  <footer className="bg-white border-t border-muted/30">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm text-muted">
        © {new Date().getFullYear()} OscarClaim. All rights reserved.
      </p>
    </div>
  </footer>
);

export const Layout = () => (
  <div className="min-h-screen w-screen flex flex-col">
    <Navigation />
    <main className="flex-1 container mx-auto px-4 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);
