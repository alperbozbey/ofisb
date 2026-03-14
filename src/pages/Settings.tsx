import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, CreditCard, ArrowLeft, Save, Plus, Trash2, Users, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { UserRole } from '../context/AppContext';

export default function Settings() {
  const { 
    companySettings, setCompanySettings,
    users, setUsers,
    notificationSettings, setNotificationSettings,
    securitySettings, setSecuritySettings,
    currentUser, setCurrentUser,
    adminPaymentSettings, setAdminPaymentSettings,
    subscriptionPackages, setSubscriptionPackages,
    products, brands, customers, tickets, accounts, invoices
  } = useAppContext();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  
  // New User Modal State
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserRole>>({
    name: '', email: '', username: '', password: '', role: 'Kullanıcı', status: 'Aktif'
  });

  // Security Form State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // File Input Ref for Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscription Package Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: 0,
    durationMonths: 1,
    features: '',
    isActive: true
  });

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.name || newPackage.price <= 0 || newPackage.durationMonths <= 0) {
      alert('Lütfen paket adı, fiyatı ve süresini geçerli değerlerle doldurun.');
      return;
    }

    const featuresArray = newPackage.features.split('\n').filter(f => f.trim() !== '');

    if (editingPackage) {
      setSubscriptionPackages(subscriptionPackages.map(pkg => 
        pkg.id === editingPackage.id 
          ? { ...editingPackage, ...newPackage, features: featuresArray } 
          : pkg
      ));
    } else {
      const newPkg = {
        id: `pkg-${Date.now()}`,
        name: newPackage.name,
        price: newPackage.price,
        durationMonths: newPackage.durationMonths,
        features: featuresArray,
        isActive: newPackage.isActive
      };
      setSubscriptionPackages([...subscriptionPackages, newPkg]);
    }

    setShowPackageModal(false);
    setEditingPackage(null);
    setNewPackage({ name: '', price: 0, durationMonths: 1, features: '', isActive: true });
  };

  const handleEditPackage = (pkg: any) => {
    setEditingPackage(pkg);
    setNewPackage({
      name: pkg.name,
      price: pkg.price,
      durationMonths: pkg.durationMonths,
      features: pkg.features.join('\n'),
      isActive: pkg.isActive
    });
    setShowPackageModal(true);
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Bu paketi silmek istediğinize emin misiniz?')) {
      setSubscriptionPackages(subscriptionPackages.filter(pkg => pkg.id !== id));
    }
  };

  const baseSections = [
    {
      id: 'general',
      title: 'Genel Ayarlar',
      icon: SettingsIcon,
      description: 'Firma bilgileri, para birimi ve temel sistem ayarları.',
    },
    {
      id: 'users',
      title: 'Kullanıcılar ve Roller',
      icon: User,
      description: 'Sisteme erişebilecek kullanıcıları ve yetkilerini yönetin.',
    },
    {
      id: 'notifications',
      title: 'Bildirimler',
      icon: Bell,
      description: 'E-posta ve SMS bildirim tercihlerini yapılandırın.',
    },
    {
      id: 'security',
      title: 'Güvenlik',
      icon: Shield,
      description: 'Şifre politikaları ve iki adımlı doğrulama ayarları.',
    },
    {
      id: 'backup',
      title: 'Yedekleme ve Veri',
      icon: Database,
      description: 'Veritabanı yedekleme ve dışa/içe aktarma işlemleri.',
    },
    {
      id: 'billing',
      title: 'Abonelik ve Fatura',
      icon: CreditCard,
      description: 'Ofisb abonelik planınız ve ödeme geçmişiniz.',
    }
  ];

  const adminSections = [
    {
      id: 'subscription_management',
      title: 'Abonelik Yönetimi',
      icon: Users,
      description: 'Müşteri paketlerini ve üyelik sürelerini yönetin.',
    },
    {
      id: 'payment_settings',
      title: 'Ödeme Ayarları',
      icon: CreditCard,
      description: 'Müşterilerin göreceği IBAN ve paket yenileme bilgilerini düzenleyin.',
    }
  ];

  const settingsSections = currentUser?.role === 'Admin' ? [...baseSections, ...adminSections] : baseSections;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Genel ayarlar başarıyla kaydedildi.');
    setActiveSection(null);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Bildirim ayarları başarıyla kaydedildi.');
    setActiveSection(null);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Yeni şifreler eşleşmiyor.');
      return;
    }
    if (passwords.current !== currentUser?.password) {
      alert('Mevcut şifre yanlış.');
      return;
    }
    
    // Update password
    const updatedUser = { ...currentUser, password: passwords.new };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setSecuritySettings({ ...securitySettings, passwordLastChanged: new Date().toLocaleDateString('tr-TR') });
    setPasswords({ current: '', new: '', confirm: '' });
    
    alert('Güvenlik ayarları ve şifre başarıyla kaydedildi.');
    setActiveSection(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    setUsers([...users, { ...newUser, id: newId } as UserRole]);
    setShowNewUserModal(false);
    setNewUser({ name: '', email: '', username: '', password: '', role: 'Kullanıcı', status: 'Aktif' });
    alert('Yeni kullanıcı başarıyla eklendi.');
  };

  const handleExportData = () => {
    const data = {
      companySettings,
      users,
      notificationSettings,
      securitySettings,
      adminPaymentSettings,
      products,
      brands,
      customers,
      tickets,
      accounts,
      invoices
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ofisb-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.companySettings) setCompanySettings(data.companySettings);
        if (data.users) setUsers(data.users);
        if (data.notificationSettings) setNotificationSettings(data.notificationSettings);
        if (data.securitySettings) setSecuritySettings(data.securitySettings);
        if (data.adminPaymentSettings) setAdminPaymentSettings(data.adminPaymentSettings);
        alert('Veriler başarıyla içe aktarıldı.');
      } catch (error) {
        alert('Geçersiz dosya formatı.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ödeme ayarları başarıyla kaydedildi.');
    setActiveSection(null);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <form onSubmit={handleSaveGeneral} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Genel Ayarlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Firma Adı</label>
                <input 
                  type="text" 
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                <input 
                  type="email" 
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                <input 
                  type="text" 
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Para Birimi</label>
                <select 
                  value={companySettings.currency}
                  onChange={(e) => setCompanySettings({...companySettings, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="TRY">Türk Lirası (₺)</option>
                  <option value="USD">Amerikan Doları ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
                <textarea 
                  rows={3}
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </form>
        );

      case 'users':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Kullanıcılar ve Roller</h2>
              <button 
                onClick={() => {
                  const newUsername = prompt('Kullanıcı Adı:');
                  if (!newUsername) return;
                  const newPassword = prompt('Şifre:');
                  if (!newPassword) return;
                  const newEmail = prompt('E-posta:');
                  if (!newEmail) return;
                  const newRole = prompt('Rol (Admin veya Kullanıcı):', 'Kullanıcı');
                  if (newRole !== 'Admin' && newRole !== 'Kullanıcı') {
                    alert('Geçersiz rol.');
                    return;
                  }

                  const newUser = {
                    id: Math.max(...users.map(u => u.id), 0) + 1,
                    username: newUsername,
                    password: newPassword,
                    name: newUsername,
                    email: newEmail,
                    role: newRole as 'Admin' | 'Kullanıcı',
                    status: 'Aktif' as const,
                    subscriptionEndDate: newRole === 'Admin' ? '2030-12-31' : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  };
                  setUsers([...users, newUser]);
                  alert('Yeni kullanıcı eklendi.');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Yeni Kullanıcı
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Kullanıcı</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Rol</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <form onSubmit={handleSaveNotifications} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Bildirim Ayarları</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">E-posta Faturaları</h3>
                  <p className="text-sm text-slate-500">Müşterilere faturaları otomatik olarak e-posta ile gönder.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailInvoices}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailInvoices: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">SMS Bildirimleri</h3>
                  <p className="text-sm text-slate-500">Teknik servis durum güncellemelerini müşteriye SMS ile bildir.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.smsAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, smsAlerts: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">Pazarlama E-postaları</h3>
                  <p className="text-sm text-slate-500">Ofisb'den gelen yenilikler ve kampanyalar hakkında e-posta al.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.marketingEmails}
                    onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </form>
        );

      case 'security':
        return (
          <form onSubmit={handleSaveSecurity} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Güvenlik Ayarları</h2>
            
            <div className="space-y-4 mb-8">
              <h3 className="font-medium text-slate-900">Şifre Değiştir</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Şifre</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
                <input 
                  type="password" 
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                <input 
                  type="password" 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>
              <p className="text-xs text-slate-500">Son şifre değiştirme: {securitySettings.passwordLastChanged}</p>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">İki Adımlı Doğrulama (2FA)</h3>
                  <p className="text-sm text-slate-500">Hesabınızı korumak için ek bir güvenlik katmanı ekleyin.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </form>
        );

      case 'backup':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Yedekleme ve Veri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-slate-200 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database size={24} />
                </div>
                <h3 className="font-medium text-slate-900 mb-2">Verileri Dışa Aktar</h3>
                <p className="text-sm text-slate-500 mb-4">Tüm müşteri, fatura ve ürün verilerinizi JSON formatında indirin.</p>
                <button 
                  onClick={handleExportData}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full"
                >
                  Dışa Aktar
                </button>
              </div>
              <div className="p-6 border border-slate-200 rounded-xl text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database size={24} />
                </div>
                <h3 className="font-medium text-slate-900 mb-2">Verileri İçe Aktar</h3>
                <p className="text-sm text-slate-500 mb-4">Önceden dışa aktardığınız verileri sisteme geri yükleyin.</p>
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef} 
                  onChange={handleImportData} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full"
                >
                  İçe Aktar
                </button>
              </div>
            </div>
          </div>
        );

      case 'billing': {
        const userPackage = subscriptionPackages.find(p => p.id === currentUser?.subscriptionPackageId);
        const endDate = currentUser?.subscriptionEndDate ? new Date(currentUser.subscriptionEndDate) : null;
        const now = new Date();
        const isExpired = endDate ? endDate < now : true;
        const remainingDays = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Abonelik ve Fatura</h2>
            <div className={`p-6 rounded-xl text-white ${isExpired ? 'bg-red-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">{userPackage ? userPackage.name : 'Deneme Sürümü'}</h3>
                  <p className="text-blue-100 text-sm">{userPackage ? userPackage.features.join(', ') : '1 Aylık Ücretsiz Deneme'}</p>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                  {isExpired ? 'Süresi Doldu' : 'Aktif'}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-6">
                {userPackage ? (
                  <>
                    <span className="text-4xl font-bold">₺{userPackage.price}</span>
                    <span className="text-blue-100 mb-1">/ {userPackage.durationMonths} ay</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">Ücretsiz</span>
                )}
              </div>
              <div className="mb-6">
                <p className="text-sm text-blue-100">
                  {isExpired 
                    ? 'Aboneliğinizin süresi dolmuştur. Lütfen yenileyiniz.' 
                    : `Kalan Kullanım Süresi: ${remainingDays} Gün (Bitiş: ${endDate?.toLocaleDateString('tr-TR')})`}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowPaymentInfo(!showPaymentInfo)} className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Planı Yükselt / Yenile
                </button>
                <button onClick={() => alert('Abonelik iptal işlemi için müşteri hizmetleri ile iletişime geçin.')} className="px-4 py-2 bg-blue-700/50 text-white rounded-lg text-sm font-medium hover:bg-blue-700/70 transition-colors border border-white/10">
                  İptal Et
                </button>
              </div>
            </div>
            
            {showPaymentInfo && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Ödeme Bilgileri</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Banka</label>
                    <div className="font-medium text-slate-900">{adminPaymentSettings.bankName || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Alıcı Adı</label>
                    <div className="font-medium text-slate-900">{adminPaymentSettings.accountHolder || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">IBAN</label>
                    <div className="font-mono font-medium text-slate-900 bg-white p-2 border border-slate-200 rounded-lg select-all">
                      {adminPaymentSettings.iban || '-'}
                    </div>
                  </div>
                  {adminPaymentSettings.notes && (
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                      <strong>Not:</strong> {adminPaymentSettings.notes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    alert('Ödeme bildiriminiz yöneticiye başarıyla iletildi. Kontrol edildikten sonra aboneliğiniz onaylanacaktır.');
                    setShowPaymentInfo(false);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Ödemeyi Yaptım
                </button>
              </div>
            )}
          </div>
        );
      }

      case 'subscription_management':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Abonelik Yönetimi</h2>
            </div>
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
                            <span className="text-slate-500 text-sm">Sınırsız</span>
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
        );

      case 'payment_settings':
        return (
          <div className="space-y-6">
            <form onSubmit={handleSavePaymentSettings} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Banka ve Ödeme Bilgileri</h2>
              <p className="text-sm text-slate-500 mb-6">Müşterilerinizin abonelik süreleri dolduğunda görecekleri ödeme bilgilerini buradan düzenleyebilirsiniz.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Banka Adı</label>
                  <input 
                    type="text" 
                    value={adminPaymentSettings.bankName}
                    onChange={(e) => setAdminPaymentSettings({...adminPaymentSettings, bankName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alıcı Adı Soyadı / Ünvan</label>
                  <input 
                    type="text" 
                    value={adminPaymentSettings.accountHolder}
                    onChange={(e) => setAdminPaymentSettings({...adminPaymentSettings, accountHolder: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">IBAN Numarası</label>
                  <input 
                    type="text" 
                    value={adminPaymentSettings.iban}
                    onChange={(e) => setAdminPaymentSettings({...adminPaymentSettings, iban: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Müşteriye Notlar</label>
                  <textarea 
                    rows={3}
                    value={adminPaymentSettings.notes}
                    onChange={(e) => setAdminPaymentSettings({...adminPaymentSettings, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Örn: Açıklama kısmına kullanıcı adınızı yazmayı unutmayın."
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save size={16} />
                  Kaydet
                </button>
              </div>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Abonelik Paketleri</h2>
                  <p className="text-sm text-slate-500">Müşterilerinize sunacağınız abonelik paketlerini yönetin.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingPackage(null);
                    setNewPackage({ name: '', price: 0, durationMonths: 1, features: '', isActive: true });
                    setShowPackageModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Yeni Paket
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptionPackages.map(pkg => (
                  <div key={pkg.id} className={`border rounded-xl p-5 relative ${pkg.isActive ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-slate-50 opacity-75'}`}>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => handleEditPackage(pkg)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                        <SettingsIcon size={16} />
                      </button>
                      <button onClick={() => handleDeletePackage(pkg.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-slate-900">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-slate-900">₺{pkg.price}</span>
                        <span className="text-sm text-slate-500">/ {pkg.durationMonths} Ay</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${pkg.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {pkg.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {activeSection && (
          <button 
            onClick={() => setActiveSection(null)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-slate-900">
          {activeSection 
            ? settingsSections.find(s => s.id === activeSection)?.title 
            : 'Ayarlar'}
        </h1>
      </div>

      {!activeSection ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsSections.map((section) => (
            <div 
              key={section.id} 
              onClick={() => setActiveSection(section.id)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <section.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{section.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl">
          {renderSectionContent()}
        </div>
      )}

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingPackage ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}
              </h3>
              <button onClick={() => setShowPackageModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePackage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paket Adı</label>
                <input 
                  type="text" 
                  required
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Örn: Yıllık Plan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fiyat (₺)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({...newPackage, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Süre (Ay)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newPackage.durationMonths}
                    onChange={(e) => setNewPackage({...newPackage, durationMonths: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Özellikler (Her satıra bir özellik)</label>
                <textarea 
                  rows={4}
                  value={newPackage.features}
                  onChange={(e) => setNewPackage({...newPackage, features: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Sınırsız kullanıcı&#10;Tüm özellikler&#10;Öncelikli destek"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={newPackage.isActive}
                  onChange={(e) => setNewPackage({...newPackage, isActive: e.target.checked})}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Aktif (Müşteriler görebilir)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Kullanıcıyı Sil</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600">Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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
