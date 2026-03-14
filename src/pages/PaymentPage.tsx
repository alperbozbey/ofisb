import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LogOut, AlertCircle, CreditCard, CheckCircle2 } from 'lucide-react';

export default function PaymentPage() {
  const { adminPaymentSettings, subscriptionPackages, setCurrentUser } = useAppContext();

  const activePackages = subscriptionPackages.filter(pkg => pkg.isActive);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans py-12">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-900">Abonelik Süreniz Doldu</h2>
              <p className="text-sm text-red-700">Uygulamayı kullanmaya devam etmek için aboneliğinizi yenilemeniz gerekmektedir.</p>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Abonelik Paketleri</h2>
          <p className="text-slate-500">İhtiyacınıza uygun paketi seçerek kullanıma devam edin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activePackages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:border-blue-300 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">₺{pkg.price}</span>
                <span className="text-slate-500">/ {pkg.durationMonths} Ay</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {activePackages.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-500 bg-white rounded-2xl border border-slate-200">
              Şu anda aktif bir abonelik paketi bulunmamaktadır. Lütfen yönetici ile iletişime geçin.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Ödeme Bilgileri
            </h3>
            <p className="text-sm text-slate-500 mt-1">Seçtiğiniz paketin tutarını aşağıdaki hesaba havale/EFT yapabilirsiniz.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
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
            </div>

            <div className="flex flex-col justify-between">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6">
                <strong>Not:</strong> {adminPaymentSettings.notes || 'Lütfen açıklama kısmına kullanıcı adınızı yazmayı unutmayın.'}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => alert('Ödeme bildiriminiz yöneticiye başarıyla iletildi. Kontrol edildikten sonra aboneliğiniz onaylanacaktır.')}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Ödemeyi Yaptım
                </button>
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
        </div>
      </div>
    </div>
  );
}
