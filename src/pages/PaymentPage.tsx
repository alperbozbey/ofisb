import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LogOut, AlertCircle, CreditCard } from 'lucide-react';

export default function PaymentPage() {
  const { adminPaymentSettings, setCurrentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-900">Abonelik Süreniz Doldu</h2>
            <p className="text-sm text-red-700">Uygulamayı kullanmaya devam etmek için aboneliğinizi yenilemeniz gerekmektedir.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
              <CreditCard size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Aylık Paket: ₺{adminPaymentSettings.monthlyPrice}</h3>
            <p className="text-slate-500 text-sm">Aşağıdaki banka hesabına ödeme yaparak aboneliğinizi yenileyebilirsiniz.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Banka</label>
              <div className="font-medium text-slate-900">{adminPaymentSettings.bankName}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Alıcı Adı</label>
              <div className="font-medium text-slate-900">{adminPaymentSettings.accountHolder}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">IBAN</label>
              <div className="font-mono font-medium text-slate-900 bg-white p-2 border border-slate-200 rounded-lg select-all">
                {adminPaymentSettings.iban}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
            <strong>Not:</strong> {adminPaymentSettings.notes}
          </div>

          <button 
            onClick={() => setCurrentUser(null)}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
