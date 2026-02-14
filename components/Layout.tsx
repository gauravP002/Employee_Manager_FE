
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { authActions } from '../features/auth/authSlice';
import { notificationActions } from '../features/notifications/notificationSlice';

const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(notificationActions.startPolling());
    return () => {
      dispatch(notificationActions.stopPolling());
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(authActions.logoutRequest());
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fa-chart-pie', roles: ['EMPLOYEE', 'MANAGER'] },
    { label: 'My Tasks', path: '/tasks', icon: 'fa-tasks', roles: ['EMPLOYEE', 'MANAGER'] },
    { label: 'Approvals', path: '/approvals', icon: 'fa-check-double', roles: ['MANAGER'] },
    { label: 'Profile', path: '/profile', icon: 'fa-user-circle', roles: ['EMPLOYEE', 'MANAGER'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">WORKFLOW AI</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded hover:bg-slate-800">
            <i className={`fas ${isSidebarOpen ? 'fa-angle-left' : 'fa-bars'}`}></i>
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full p-3 text-slate-400 hover:text-red-400 transition-colors">
            <i className="fas fa-sign-out-alt w-6 text-center"></i>
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
          </h2>
          
          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <i className="far fa-bell text-xl text-slate-600"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
