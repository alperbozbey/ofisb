import React, { useState } from 'react';
import { Plus, Filter, Download, MoreHorizontal, CheckCircle2, AlertCircle, Clock, X, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type InvoiceType = 'sale' | 'purchase';

type Invoice = {
  id: string;
  type: InvoiceType;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
};

const initialInvoices: Invoice[] = [
  { id: 'INV-2024-001', type: 'sale', customer: 'ABC Teknoloji A.Ş.', date: '12 Eki 2024', dueDate: '12 Kas 2024', amount: '₺12.500,00', status: 'paid' },
  { id: 'INV-2024-002', type: 'sale', customer: 'XYZ Yazılım Ltd.', date: '15 Eki 2024', dueDate: '15 Kas 2024', amount: '₺4.200,00', status: 'pending' },
  { id: 'INV-2024-003', type: 'sale', customer: 'Ofis Kırtasiye', date: '01 Eyl 2024', dueDate: '01 Eki 2024', amount: '₺850,00', status: 'overdue' },
  { id: 'INV-2024-004', type: 'sale', customer: 'Global Lojistik', date: '20 Eki 2024', dueDate: '20 Kas 2024', amount: '₺28.400,00', status: 'pending' },
  { id: 'INV-2024-005', type: 'sale', customer: 'Mega Market', date: '05 Eki 2024', dueDate: '05 Kas 2024', amount: '₺3.150,00', status: 'paid' },
];

export default function Invoices() {
  const { products, updateProductStockAndPrice } = useAppContext();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState('all');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    items: [{ productId: '', quantity: 1, price: 0 }]
  });

  const handleAddPurchaseItem = () => {
    setNewPurchase({
      ...newPurchase,
      items: [...newPurchase.items, { productId: '', quantity: 1, price: 0 }]
    });
  };

  const handleRemovePurchaseItem = (index: number) => {
    const newItems = [...newPurchase.items];
    newItems.splice(index, 1);
    setNewPurchase({ ...newPurchase, items: newItems });
  };

  const handlePurchaseItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...newPurchase.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill price if product is selected
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.id === Number(value));
      if (selectedProduct) {
        newItems[index].price = selectedProduct.purchasePrice;
      }
    }
    
    setNewPurchase({ ...newPurchase, items: newItems });
  };

  const calculateTotal = () => {
    return newPurchase.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = calculateTotal();
    
    const newInvoice: Invoice = {
      id: newPurchase.invoiceNo || `PUR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      type: 'purchase',
      customer: newPurchase.supplier,
      date: new Date(newPurchase.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: new Date(newPurchase.dueDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: `₺${totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      status: 'paid' // Assuming paid for simplicity, could be pending
    };

    setInvoices([newInvoice, ...invoices]);

    // Update stock and purchase price for each item
    newPurchase.items.forEach(item => {
      if (item.productId) {
        updateProductStockAndPrice(Number(item.productId), Number(item.quantity), Number(item.price));
      }
    });

    setIsPurchaseModalOpen(false);
    setNewPurchase({
      supplier: '',
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [{ productId: '', quantity: 1, price: 0 }]
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sales') return inv.type === 'sale';
    if (activeTab === 'purchases') return inv.type === 'purchase';
    return inv.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Faturalar</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} />
            Dışa Aktar
          </button>
          <button 
            onClick={() => setIsPurchaseModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Yeni Alış Faturası
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} />
            Yeni Satış Faturası
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-3 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            <button 
              onClick={() => setActiveTab('all')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Tümü
            </button>
            <button 
              onClick={() => setActiveTab('sales')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'sales' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Satış Faturaları
            </button>
            <button 
              onClick={() => setActiveTab('purchases')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'purchases' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Alış Faturaları
            </button>
            <button 
              onClick={() => setActiveTab('paid')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'paid' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Ödenenler
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Bekleyenler
            </button>
            <button 
              onClick={() => setActiveTab('overdue')}
              className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
                activeTab === 'overdue' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Gecikenler
            </button>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-4">
            <Filter size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Tür</th>
                <th className="px-6 py-4 font-medium">Fatura No</th>
                <th className="px-6 py-4 font-medium">Cari / Tedarikçi</th>
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium">Vade</th>
                <th className="px-6 py-4 font-medium text-right">Tutar</th>
                <th className="px-6 py-4 font-medium text-center">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((invoice, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    {invoice.type === 'sale' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">Satış</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700">Alış</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {invoice.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    Bu kritere uygun fatura bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Dummy) */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500">Toplam {filteredInvoices.length} fatura gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white disabled:opacity-50" disabled>Önceki</button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-600 rounded text-sm text-white">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 hover:bg-white">Sonraki</button>
          </div>
        </div>
      </div>

      {/* New Purchase Invoice Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Yeni Alış Faturası</h2>
              <button 
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSavePurchase} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tedarikçi</label>
                  <input 
                    type="text" 
                    required
                    value={newPurchase.supplier}
                    onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Tedarikçi firma adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fatura No (Opsiyonel)</label>
                  <input 
                    type="text" 
                    value={newPurchase.invoiceNo}
                    onChange={(e) => setNewPurchase({...newPurchase, invoiceNo: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Otomatik oluşturulacak"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fatura Tarihi</label>
                  <input 
                    type="date" 
                    required
                    value={newPurchase.date}
                    onChange={(e) => setNewPurchase({...newPurchase, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vade Tarihi</label>
                  <input 
                    type="date" 
                    required
                    value={newPurchase.dueDate}
                    onChange={(e) => setNewPurchase({...newPurchase, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">Ürünler</h3>
                  <button 
                    type="button"
                    onClick={handleAddPurchaseItem}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Yeni Satır Ekle
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newPurchase.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Ürün Seçin</label>
                        <select
                          required
                          value={item.productId}
                          onChange={(e) => handlePurchaseItemChange(index, 'productId', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                          <option value="">Seçiniz...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock !== null ? p.stock : 'Sınırsız'})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Adet</label>
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handlePurchaseItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Birim Alış (₺)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={item.price}
                          onChange={(e) => handlePurchaseItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Toplam (₺)</label>
                        <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                          {(item.quantity * item.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="pt-6">
                        <button 
                          type="button"
                          onClick={() => handleRemovePurchaseItem(index)}
                          disabled={newPurchase.items.length === 1}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-64">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">Ara Toplam:</span>
                      <span className="font-medium text-slate-700">₺{calculateTotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">KDV (%20):</span>
                      <span className="font-medium text-slate-700">₺{(calculateTotal() * 0.2).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-slate-200">
                      <span className="text-slate-900">Genel Toplam:</span>
                      <span className="text-blue-600">₺{(calculateTotal() * 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button 
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Faturayı Kaydet ve Stokları Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'paid':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={14} />
          Ödendi
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          <Clock size={14} />
          Bekliyor
        </span>
      );
    case 'overdue':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertCircle size={14} />
          Gecikti
        </span>
      );
    default:
      return null;
  }
}
