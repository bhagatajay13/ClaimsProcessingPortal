import type { ChangeEvent } from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setRole } from '../features/auth/authSlice';
import type { UserRole } from '../features/auth/permissions';

export default function Header() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setRole(event.target.value as UserRole));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">

      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Insurance Claims Management
        </h2>
      </div>

      <div className="flex items-center gap-5">

        <button className="text-slate-500 hover:text-blue-600">
          <Bell size={21} />
        </button>

        <div className="flex items-center gap-3">
          <select
            value={role}
            onChange={handleRoleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="ADMIN">Admin</option>
            <option value="CLAIMS_MANAGER">Claims Manager</option>
            <option value="VIEWER">Viewer</option>
          </select>

          <div className="flex items-center gap-2">
            <UserCircle size={30} className="text-slate-500" />
            <div className="text-right">
              <p className="font-semibold text-sm text-slate-800">
                {role === 'ADMIN'
                  ? 'Admin User'
                  : role === 'CLAIMS_MANAGER'
                  ? 'Claims Manager'
                  : 'Viewer User'}
              </p>
              <p className="text-xs text-gray-500">Current Role</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}