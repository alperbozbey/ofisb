import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, UserPlus, Building2, Phone, Mail, X, Edit, Trash2, History, Receipt, Wrench } from 'lucide-react';
import { useAppContext, Customer } from '../context/AppContext';

export default function Customers() {
  const { customers, setCustomers, invoices, tickets } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Kurumsal',
    group: 'Perakende',
    contact: '',
    phone: '',
    email: '',
    balance: '₺0,00',
    status: 'active'
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                        (filterType === 'corporate' && c.type === 'Kurumsal') || 
                        (filterType === 'individual' && c.type === 'Bireysel') ||
                        (filterType === 'supplier' && c.type === 'Tedarikçi');
    const matchesGroup = filterGroup === 'all' || c.group === filterGroup;
    
    return matchesSearch && matchesType && matchesGroup;
  });

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      type: 'Kurumsal',
      group: 'Perakende',
      contact: '',
      phone: '',
      email: '',
      balance: '₺0,00',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      type: customer.type,
      group: customer.group,
      contact: customer.contact,
      phone: customer.phone,
      email: customer.email,
      balance: customer.balance,
      status: customer.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleOpenHistory = (customer: Customer) => {
    setSelectedCustomerForHistory(customer);
    setHistoryModalOpen(true);
  };

  const getCustomerHistory = () => {
    if (!selectedCustomerForHistory) return [];

    const customerInvoices = invoices
      .filter(inv => inv.customer === selectedCustomerForHistory.name)
      .map(inv => ({
        id: inv.id,
        date: inv.date,
        description: inv.type === 'sale' ? 'Satış Faturası' : 'Alış Faturası',
        amount: inv.amount,
        type: inv.type === 'sale' ? 'income' : 'expense',
        status: inv.status,
        icon: Receipt
      }));

    const customerTickets = tickets
      .filter(t => t.customer === selectedCustomerForHistory.name)
      .map(t => ({
        id: t.id,
        date: t.date,
        description: `Teknik Servis (${t.device})`,
        amount: t.price,
        type: 'income',
        status: t.status,
        icon: Wrench
      }));

    return [...customerInvoices, ...customerTickets].sort((a, b) => {
      // Simple string sort for dates like '12 Eki 2024' (not perfect but works for demo)
      return b.id.localeCompare(a.id); 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
    } else {
      const newId = Math.max(0, ...customers.map(c => c.id)) + 1;
      setCustomers([...customers, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Müşteriler & Tedarikçiler</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <UserPlus size={16} />
            İçe Aktar
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Yeni Cari Hesap
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari hesap adı, yetkili veya e-posta ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select 
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tüm Gruplar</option>
            <option value="Tedarikçi">Tedarikçi</option>
            <option value="Perakende">Perakende</option>
            <option value="Toptan">Toptan</option>
          </select>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tüm Tipler</option>
            <option value="corporate">Kurumsal</option>
            <option value="individual">Bireysel</option>
            <option value="supplier">Tedarikçi</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow group relative">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenEditModal(customer)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Düzenle"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(customer.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Sil"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                {customer.type === 'Kurumsal' ? <Building2 size={24} /> : <UserPlus size={24} />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 leading-tight mb-1 pr-16 truncate" title={customer.name}>
                  {customer.name}
                </h3>
                <div className="flex gap-1 flex-wrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                    {customer.type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    customer.group === 'Tedarikçi' ? 'bg-purple-100 text-purple-700' :
                    customer.group === 'Toptan' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {customer.group}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <UserPlus size={14} className="text-slate-400" />
                <span className="truncate">{customer.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">Bakiye</span>
              <span className={`text-lg font-bold ${
                customer.balance.startsWith('-') ? 'text-red-600' : 
                customer.balance === '₺0,00' ? 'text-slate-900' : 'text-emerald-600'
              }`}>
                {customer.balance}
              </span>
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button 
                onClick={() => handleOpenHistory(customer)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-blue-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <History size={16} />
                Hesap Hareketleri
              </button>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            Arama kriterlerine uygun müşteri bulunamadı.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingCustomer ? 'Cari Hesap Düzenle' : 'Yeni Cari Hesap'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Firma / Kişi Adı</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hesap Tipi</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Kurumsal">Kurumsal</option>
                    <option value="Bireysel">Bireysel</option>
                    <option value="Tedarikçi">Tedarikçi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Grubu</label>
                  <select 
                    value={formData.group}
                    onChange={(e) => setFormData({...formData, group: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Tedarikçi">Tedarikçi</option>
                    <option value="Perakende">Perakende</option>
                    <option value="Toptan">Toptan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yetkili Kişi</label>
                  <input 
                    type="text" 
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-200">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCustomer ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && selectedCustomerForHistory && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Hesap Hareketleri</h2>
                <p className="text-sm text-slate-500">{selectedCustomerForHistory.name}</p>
              </div>
              <button 
                onClick={() => setHistoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {getCustomerHistory().length > 0 ? (
                <div className="space-y-4">
                  {getCustomerHistory().map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>{item.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-bold ${
                          item.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {item.type === 'income' ? '+' : '-'}{item.amount}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                          item.status === 'paid' || item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'pending' || item.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History size={32} />
                  </div>
                  <h3 className="text-base font-medium text-slate-900 mb-1">İşlem Geçmişi Yok</h3>
                  <p className="text-sm text-slate-500">Bu cari hesaba ait henüz bir işlem bulunmuyor.</p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center">
              <span className="text-sm text-slate-500">Güncel Bakiye:</span>
              <span className={`text-lg font-bold ${
                selectedCustomerForHistory.balance.startsWith('-') ? 'text-red-600' : 
                selectedCustomerForHistory.balance === '₺0,00' ? 'text-slate-900' : 'text-emerald-600'
              }`}>
                {selectedCustomerForHistory.balance}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
