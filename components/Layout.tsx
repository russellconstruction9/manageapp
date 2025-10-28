import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import UserSwitcher from './UserSwitcher';
import { Link } from 'react-router-dom';
import { SccLogoIcon } from './icons/Icons';
import PWAFeatures from './PWAFeatures';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen font-sans text-gray-900 bg-gray-100">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Mobile Logo - hidden on medium screens and up */}
                <Link to="/" className="flex items-center gap-2 md:hidden">
                    <SccLogoIcon className="w-8 h-8 text-blue-600" />
                    <span className="font-bold text-lg text-primary-navy">Stoney Creek</span>
                </Link>

                {/* Spacer for desktop layout to push controls right */}
                <div className="hidden md:flex flex-1"></div>
                
                <div className="flex items-center gap-4">
                    {/* Current user email */}
                    <div className="hidden md:flex text-sm text-gray-600">
                      {user?.email}
                    </div>
                    
                    <PWAFeatures />
                    <UserSwitcher />
                    
                    {/* Logout button */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sign out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      <span className="hidden md:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
            {children}
            </div>
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
