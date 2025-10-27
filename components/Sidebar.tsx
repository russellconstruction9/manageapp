import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Building2Icon, ClipboardCheckIcon, ClockIcon, LayoutDashboardIcon, ListChecksIcon, UsersIcon, SccLogoIcon } from './icons/Icons';
import CompanySwitcher from './CompanySwitcher';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/projects', label: 'Projects', icon: Building2Icon },
  { path: '/tasks', label: 'Tasks', icon: ListChecksIcon },
  { path: '/team', label: 'Team', icon: UsersIcon },
  { path: '/time-tracking', label: 'Time Tracking', icon: ClockIcon },
  { path: '/punch-lists', label: 'Punch Lists', icon: ClipboardCheckIcon },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-start px-4 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-3">
          <SccLogoIcon className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-xl text-primary-navy">Stoney Creek</span>
        </Link>
      </div>
      <div className="px-4 py-2 border-b border-slate-200">
        <CompanySwitcher />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;