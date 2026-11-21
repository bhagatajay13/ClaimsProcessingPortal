
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Claims', path: '/claims', icon: FileText }
];

export default function Sidebar() {
  return (
    <aside className="w-[240px] min-h-screen bg-white border-r border-violet-200 px-3 py-6 shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-12">
        <ShieldCheck size={25} className="text-violet-600" />
        <h1 className="text-xl font-bold text-gray-900">
          Claims Portal
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-500 hover:bg-violet-50 hover:text-violet-600'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
