import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, UserPlus, Building2, Phone, Mail } from 'lucide-react';

const customers = [
  { id: 1, name: 'ABC Teknoloji A.Ş.', type: 'Kurumsal', contact: 'Ahmet Yılmaz', phone: '0532 123 45 67', email: 'ahmet@abcteknoloji.com', balance: '₺12.500,00', status: 'active' },
  { id: 2, name: 'XYZ Yazılım Ltd.', type: 'Kurumsal', contact: 'Ayşe Demir', phone: '0555 987 65 43', email: 'ayse@xyzyazilim.com', balance: '-₺4.200,00', status: 'active' },
  { id: 3, name: 'Ofis Kırtasiye', type: 'Bireysel', contact: 'Mehmet Kaya', phone: '0544 555 44 33', email: 'info@ofiskirtasiye.com', balance: '₺0,00', status: 'inactive' },
  { id: 4, name: 'Global Lojistik', type: 'Kurumsal', contact: 'Zeynep Çelik', phone: '0533 222 11 00', email: 'zeynep@globallojistik.com', balance: '₺28.400,00', status: 'active' },
  { id: 5, name: 'Mega Market', type: 'Kurumsal', contact: 'Ali Can', phone: '0505 666 77 88', email: 'ali@megamarket.com', balance: '₺3.150,00', status: 'active' },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Müşteriler & Tedarikçiler</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <UserPlus size={16} />
            İçe Aktar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
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
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">Tüm Tipler</option>
            <option value="corporate">Kurumsal</option>
            <option value="individual">Bireysel</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow group relative">
            <div className="absolute top-4 right-4">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                {customer.type === 'Kurumsal' ? <Building2 size={24} /> : <UserPlus size={24} />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 leading-tight mb-1 pr-6 truncate" title={customer.name}>
                  {customer.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                  {customer.type}
                </span>
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
          </div>
        ))}
      </div>
    </div>
  );
}
