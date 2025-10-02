import React from 'react';
import { Button } from '../../../components/ui/button';
import { User } from '../../../types';

interface DashboardHeaderProps {
  user: User;
  onStartStudy: () => void;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onStartStudy, onLogout }) => (
  <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm text-slate-500">Chào mừng trở lại, {user.name}!</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Sẵn sàng học từ mới hôm nay?</h1>
    </div>
    <div className="flex gap-2">
      <Button variant="secondary" className="rounded-full" onClick={onLogout}>
        Đăng xuất
      </Button>
      <Button className="rounded-full" onClick={onStartStudy}>
        Bắt đầu học
      </Button>
    </div>
  </header>
);

export default DashboardHeader;
