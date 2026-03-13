import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, FileText, Calendar, Users, Wallet } from 'lucide-react';

const reports = [
  { id: 1, title: 'KDV Raporu', description: 'Aylık KDV beyannamesi için özet rapor', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, title: 'Gelir Gider Analizi', description: 'Kategorilere göre gelir ve gider dağılımı', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 3, title: 'Nakit Akışı', description: 'Gelecek 30 günlük tahmini nakit durumu', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 4, title: 'Cari Hesap Ekstresi', description: 'Müşteri ve tedarikçi bakiye dökümleri', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 5, title: 'Banka Hareketleri', description: 'Tüm banka hesaplarının detaylı dökümü', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 6, title: 'Aylık Satış Raporu', description: 'Ürün ve hizmet bazlı satış analizleri', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-100' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Raporlar</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Calendar size={16} />
            Tarih Aralığı
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all group cursor-pointer hover:border-blue-200">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${report.bg} ${report.color}`}>
                <report.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {report.description}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Raporu Görüntüle &rarr;
              </span>
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="İndir">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
