import React, { useState } from 'react';
import { Users, Trash2, Shield, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SubscriptionManagement() {
  const { users, setUsers, subscriptionPackages } = useAppContext();
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
  };

  const confirmDeleteUser = () => {
    if (userToDelete !== null) {
      setUsers(users.filter(u => u.id !== userToDelete));
      setUserToDelete(null);
    }
  };

  const handleAddMonth = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const pkg = subscriptionPackages.find(p => p.id === u.subscriptionPackageId);
        const monthsToAdd = pkg ? pkg.durationMonths : 1;
        
        const currentEnd = u.subscriptionEndDate ? new Date(u.subscriptionEndDate) : new Date();
        const now = new Date();
        const baseDate = currentEnd > now ? currentEnd : now;
        const newEnd = new Date(baseDate.getTime() + monthsToAdd * 30 * 24 * 60 * 60 * 1000);
        return { ...u, subscriptionEndDate: newEnd.toISOString().split('T')[0] };
      }
      return u;
    }));
    alert('Kullanıcının abonelik süresi uzatıldı.');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="text-blue-600" />
          Abone Yönetimi
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Kullanıcı</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Paket</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Kalan Süre</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => {
                const isExpired = user.subscriptionEndDate ? new Date(user.subscriptionEndDate) < new Date() : true;
                const remainingDays = user.subscriptionEndDate ? Math.ceil((new Date(user.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'Admin' ? (
                        <span className="text-slate-500 text-sm">-</span>
                      ) : (
                        <select 
                          value={user.subscriptionPackageId || ''}
                          onChange={(e) => {
                            setUsers(users.map(u => u.id === user.id ? { ...u, subscriptionPackageId: e.target.value || undefined } : u));
                          }}
                          className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full max-w-[150px]"
                        >
                          <option value="">Deneme Sürümü</option>
                          {subscriptionPackages.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'Admin' ? (
                        <span className="text-slate-500 text-sm flex items-center gap-1">
                          <Shield size={14} /> Sınırsız
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {isExpired ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                              Süresi Doldu
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 w-fit">
                              {remainingDays} Gün Kaldı
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            Bitiş: {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'Admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAddMonth(user.id)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            Süre Ekle
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Aboneyi Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">Aboneyi Sil</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Bu aboneyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
