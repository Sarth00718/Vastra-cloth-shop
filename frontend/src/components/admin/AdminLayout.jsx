import { useState } from 'react';
import Nav from './Nav';
import Sidebar from './Sidebar';

function AdminLayout({ children, className = '' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Nav onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="ml-0 md:ml-[240px] pt-[64px] min-h-screen flex flex-col">
        <div className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl mx-auto">
          <div className={`w-full ${className}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
