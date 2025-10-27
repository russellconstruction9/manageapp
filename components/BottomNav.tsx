import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2Icon, ClockIcon, LayoutDashboardIcon, ListChecksIcon, UsersIcon } from './icons/Icons';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/projects', label: 'Projects', icon: Building2Icon },
  { path: '/tasks', label: 'Tasks', icon: ListChecksIcon },
  { path: '/team', label: 'Team', icon: UsersIcon },
  { path: '/time-tracking', label: 'Time', icon: ClockIcon },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full text-xs font-medium transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`
          }
        >
          <Icon className="w-6 h-6 mb-1" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
