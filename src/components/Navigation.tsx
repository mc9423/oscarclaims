import React from 'react';
import { Link } from '@tanstack/react-router';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => (
  <Link
    to={to}
    className="text-muted hover:text-primary transition-colors"
    activeProps={{ className: 'text-primary font-medium' }}
  >
    {children}
  </Link>
);

export const Navigation = () => (
  <nav className="bg-white shadow-sm justify-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center">
        <div className="flex space-x-8">
          <img src="../public/medicine-icon-svgrepo-com.svg" alt="OscarClaim" className="h-8 w-8" />
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/claims/new">New Claim</NavLink>
        </div>
      </div>
    </div>
  </nav>
); 