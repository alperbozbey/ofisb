import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Laptop,
  Monitor
} from 'lucide-react';

const mockTickets = [
  { 
    id: 'TS-2023-001', 
    customer: 'Ahmet Yılmaz', 
    device: 'iPhone 13 Pro', 
    deviceType: 'mobile',
    issue: 'Ekran Kırık, Dokunmatik Çalışmıyor', 
    status: 'pending', 
    date: '12 Eki 2023', 
    price: '₺3.500,00' 
  },
  { 
    id: 'TS-2023-002', 
    customer: 'XYZ Ltd. Şti.', 
    device: 'Dell XPS 15', 
    deviceType: 'laptop',
    issue: 'Batarya Değişimi ve Bakım', 
    status: 'in-progress', 
    date: '11 Eki 2023', 
    price: '₺1.200,00' 
  },
  { 
    id: 'TS-2023-003', 
    customer: 'Ayşe Demir', 
    device: 'Samsung 55" 4K TV', 
    deviceType: 'tv',
    issue: 'Görüntü Gidip Geliyor', 
    status: 'completed', 
    date: '09 Eki 2023', 
    price: '₺850,00' 
  },
  { 
    id: 'TS-2023-004', 
    customer: 'Mehmet Kaya', 
    device: 'MacBook Air M1', 
    deviceType: 'laptop',
    issue: 'Sıvı Teması', 
    status: 'cancelled', 
    date: '08 Eki 2023', 
    price: '-' 
  },
  { 
    id: 'TS-2023-005', 
    customer: 'Elif Şahin', 
    device: 'iPad Pro 11"', 
    deviceType: 'tablet',
    issue: 'Şarj Almıyor', 
    status: 'pending', 
    date: '13 Eki 2023', 
    price: 'Belirlenmedi' 
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200"><Clock size={12} /> Bekliyor</span>;
    case 'in-progress':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"><Wrench size={12} /> İşlemde</span>;
    case 'completed':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle size={12} /> Tamamlandı</span>;
    case 'cancelled':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 border border-red-200"><AlertCircle size={12} /> İptal Edildi</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
  }
};

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'mobile':
    case 'tablet':
      return <Smartphone size={16} className="text-slate-400" />;
    case 'laptop':
      return <Laptop size={16} className="text-slate-400" />;
    case 'tv':
    case 'monitor':
      return <Monitor size={16} className="text-slate-400" />;
    default:
      return <Wrench size={16} className="text-slate-400" />;
  }
};

export default function TechnicalService() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teknik Servis</h1>
          <p className="text-sm text-slate-500 mt-1">Müşteri cihazları ve servis kayıtlarını yönetin.</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={18} className="mr-2" />
          Yeni Servis Kaydı
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Tüm Kayıtlar
            </button>
            <button 
              onClick={() => setActiveTab('open')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'open' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Açık Kayıtlar
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Tamamlananlar
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Kayıt no, müşteri veya cihaz ara..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Filter size={18} className="mr-2 text-slate-400" />
            Filtrele
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Kayıt No & Tarih</th>
                <th className="px-6 py-4 font-medium">Müşteri</th>
                <th className="px-6 py-4 font-medium">Cihaz & Arıza</th>
                <th className="px-6 py-4 font-medium">Tutar</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{ticket.id}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{ticket.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{ticket.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-slate-100 p-1.5 rounded-md">
                        {getDeviceIcon(ticket.deviceType)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{ticket.device}</div>
                        <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">{ticket.issue}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{ticket.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <div>Toplam 5 kayıt bulunuyor</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Önceki</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}
