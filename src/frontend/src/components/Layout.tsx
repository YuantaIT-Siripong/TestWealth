import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Gift, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">WealthOps</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/inquiries"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/inquiries') || isActive('/inquiry')
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Inquiries
            </Link>
            <Link
              to="/orders"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/orders') || isActive('/order')
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Gift className="w-5 h-5 mr-3" />
              Orders
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <nav className="text-sm text-gray-500">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {(location.pathname.startsWith('/inquiries') || location.pathname.startsWith('/inquiry')) && 'Order Inquiries'}
              {(location.pathname.startsWith('/orders') || location.pathname.startsWith('/order')) && 'Orders'}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">A</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
