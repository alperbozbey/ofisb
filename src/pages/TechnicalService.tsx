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
  Monitor,
  Edit,
  Trash2,
  X,
  UserPlus
} from 'lucide-react';
import { useAppContext, Ticket, UsedPart } from '../context/AppContext';

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
  const { brands, customers, setCustomers, tickets, setTickets, products, addIncomeToAccount } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickAddCustomerOpen, setIsQuickAddCustomerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [selectedPartQuantity, setSelectedPartQuantity] = useState<number>(1);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Bireysel'
  });
  const [newTicket, setNewTicket] = useState({
    customer: '',
    deviceBrand: '',
    deviceModel: '',
    deviceType: 'mobile',
    issue: '',
    status: 'pending',
    price: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const parsePrice = (priceStr: string) => {
    if (!priceStr || priceStr === '-' || priceStr === 'Belirlenmedi') return 0;
    // Handle Turkish locale price strings like "₺3.500,00"
    const cleaned = priceStr.replace(/[^0-9,-]+/g, '');
    return parseFloat(cleaned.replace(',', '.'));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customerToAdd = {
      id: customers.length + 1,
      name: newCustomer.name,
      type: newCustomer.type,
      contact: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      balance: '₺0,00',
      status: 'active'
    };
    setCustomers([...customers, customerToAdd]);
    
    // Auto-select the newly created customer
    if (isAddModalOpen) {
      setNewTicket({ ...newTicket, customer: customerToAdd.name });
    } else if (isEditModalOpen && editingTicket) {
      setEditingTicket({ ...editingTicket, customer: customerToAdd.name });
    }
    
    setIsQuickAddCustomerOpen(false);
    setNewCustomer({ name: '', phone: '', email: '', type: 'Bireysel' });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    // If changing to completed and not already paid, add to cash
    if (newStatus === 'completed' && ticket.status !== 'completed' && !ticket.isPaid) {
      const amount = parsePrice(ticket.price);
      if (amount > 0) {
        addIncomeToAccount(1, amount); // Add to Merkez Kasa
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus, isPaid: true } : t));
        return;
      }
    }

    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDelete = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total price based on parts and labor
    let totalPartsPrice = 0;
    let totalPartsCost = 0;
    if (editingTicket.usedParts) {
      totalPartsPrice = editingTicket.usedParts.reduce((sum: number, part: UsedPart) => sum + (part.price * part.quantity), 0);
      totalPartsCost = editingTicket.usedParts.reduce((sum: number, part: UsedPart) => sum + (part.purchasePrice * part.quantity), 0);
    }
    const labor = parseFloat(editingTicket.laborCost) || 0;
    const calculatedTotal = totalPartsPrice + labor;
    const calculatedNetProfit = (totalPartsPrice - totalPartsCost) + labor;
    
    // Format price
    const formattedPrice = calculatedTotal > 0 ? `₺${calculatedTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : editingTicket.price;

    const isNewlyCompleted = editingTicket.status === 'completed' && 
                             tickets.find(t => t.id === editingTicket.id)?.status !== 'completed' &&
                             !editingTicket.isPaid;
    
    let isPaid = editingTicket.isPaid || false;

    if (isNewlyCompleted) {
      const amountToCharge = calculatedTotal > 0 ? calculatedTotal : parsePrice(editingTicket.price);
      if (amountToCharge > 0) {
        addIncomeToAccount(1, amountToCharge); // Add to Merkez Kasa
        isPaid = true;
      }
    }

    setTickets(tickets.map(t => t.id === editingTicket.id ? {
      ...editingTicket,
      device: `${editingTicket.deviceBrand} ${editingTicket.deviceModel}`.trim(),
      price: formattedPrice,
      laborCost: labor,
      partsCost: totalPartsCost,
      netProfit: calculatedNetProfit,
      isPaid
    } : t));
    setIsEditModalOpen(false);
    setEditingTicket(null);
  };

  const handleAddPart = () => {
    if (!selectedPartId) return;
    
    const product = products.find(p => p.id === parseInt(selectedPartId));
    if (!product) return;

    const newPart: UsedPart = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      quantity: selectedPartQuantity,
      price: product.price,
      purchasePrice: product.purchasePrice
    };

    setEditingTicket({
      ...editingTicket,
      usedParts: [...(editingTicket.usedParts || []), newPart]
    });

    setSelectedPartId('');
    setSelectedPartQuantity(1);
  };

  const handleRemovePart = (partId: string) => {
    setEditingTicket({
      ...editingTicket,
      usedParts: editingTicket.usedParts.filter((p: UsedPart) => p.id !== partId)
    });
  };

  const calculateTotals = () => {
    if (!editingTicket) return { partsTotal: 0, partsCost: 0, labor: 0, netProfit: 0, grandTotal: 0 };
    
    const partsTotal = (editingTicket.usedParts || []).reduce((sum: number, part: UsedPart) => sum + (part.price * part.quantity), 0);
    const partsCost = (editingTicket.usedParts || []).reduce((sum: number, part: UsedPart) => sum + (part.purchasePrice * part.quantity), 0);
    const labor = parseFloat(editingTicket.laborCost) || 0;
    
    const grandTotal = partsTotal + labor;
    const netProfit = (partsTotal - partsCost) + labor;

    return { partsTotal, partsCost, labor, netProfit, grandTotal };
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketToAdd = {
      id: `TS-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, '0')}`,
      customer: newTicket.customer,
      device: `${newTicket.deviceBrand} ${newTicket.deviceModel}`.trim(),
      deviceType: newTicket.deviceType,
      issue: newTicket.issue,
      status: newTicket.status,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      price: newTicket.price ? `₺${parseFloat(newTicket.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : 'Belirlenmedi'
    };
    setTickets([ticketToAdd, ...tickets]);
    setIsAddModalOpen(false);
    setNewTicket({
      customer: '',
      deviceBrand: '',
      deviceModel: '',
      deviceType: 'mobile',
      issue: '',
      status: 'pending',
      price: ''
    });
  };

  const handleEdit = (ticket: any) => {
    // Try to parse brand and model from device string
    let deviceBrand = '';
    let deviceModel = '';
    
    // Simple heuristic: check if device starts with any known brand
    const knownBrand = brands.find(b => ticket.device.toLowerCase().startsWith(b.name.toLowerCase()));
    if (knownBrand) {
      deviceBrand = knownBrand.name;
      deviceModel = ticket.device.substring(knownBrand.name.length).trim();
    } else {
      // Fallback
      const parts = ticket.device.split(' ');
      deviceBrand = parts[0] || '';
      deviceModel = parts.slice(1).join(' ') || '';
    }

    setEditingTicket({ 
      ...ticket,
      deviceBrand,
      deviceModel,
      rawPrice: ticket.price.replace(/[^0-9,.-]/g, '').replace(',', '.'),
      laborCost: ticket.laborCost || 0,
      usedParts: ticket.usedParts || []
    });
    setIsEditModalOpen(true);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'open') return matchesSearch && (ticket.status === 'pending' || ticket.status === 'in-progress');
    if (activeTab === 'completed') return matchesSearch && ticket.status === 'completed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teknik Servis</h1>
          <p className="text-sm text-slate-500 mt-1">Müşteri cihazları ve servis kayıtlarını yönetin.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredTickets.map((ticket) => (
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
                    {ticket.netProfit !== undefined && (
                      <div className="text-emerald-600 text-xs mt-0.5 font-medium">
                        Kar: ₺{ticket.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className={`text-xs font-medium rounded-md px-2.5 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                        ticket.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        ticket.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      <option value="pending">Bekliyor</option>
                      <option value="in-progress">İşlemde</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(ticket)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ticket.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <div>Toplam {filteredTickets.length} kayıt bulunuyor</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Önceki</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Sonraki</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingTicket && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Servis Kaydını Düzenle</h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingTicket(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri</label>
                <div className="flex gap-2">
                  <select 
                    required
                    value={editingTicket.customer}
                    onChange={(e) => setEditingTicket({...editingTicket, customer: e.target.value})}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Müşteri Seçin</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddCustomerOpen(true)}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Hızlı Müşteri Ekle"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cihaz Markası</label>
                  <select 
                    required
                    value={editingTicket.deviceBrand}
                    onChange={(e) => setEditingTicket({...editingTicket, deviceBrand: e.target.value, deviceModel: ''})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cihaz Modeli</label>
                  <select 
                    required
                    value={editingTicket.deviceModel}
                    onChange={(e) => setEditingTicket({...editingTicket, deviceModel: e.target.value})}
                    disabled={!editingTicket.deviceBrand}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Seçiniz</option>
                    {brands.find(b => b.name === editingTicket.deviceBrand)?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Arıza/İşlem</label>
                <textarea 
                  required
                  rows={3}
                  value={editingTicket.issue}
                  onChange={(e) => setEditingTicket({...editingTicket, issue: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Kullanılan Parçalar ve İşçilik</h4>
                
                {/* Parça Ekleme */}
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Parça Seçin (Ürünler)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ₺{p.price}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedPartQuantity}
                    onChange={(e) => setSelectedPartQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddPart}
                    disabled={!selectedPartId}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Eklenen Parçalar Listesi */}
                {editingTicket.usedParts && editingTicket.usedParts.length > 0 && (
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 mb-3 space-y-2">
                    {editingTicket.usedParts.map((part: UsedPart) => (
                      <div key={part.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-100">
                        <div className="flex-1">
                          <span className="font-medium text-slate-700">{part.name}</span>
                          <span className="text-slate-500 ml-2">{part.quantity} adet x ₺{part.price}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-slate-900">₺{part.quantity * part.price}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePart(part.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* İşçilik */}
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-sm font-medium text-slate-700 w-24">İşçilik Ücreti:</label>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₺</span>
                    <input
                      type="number"
                      min="0"
                      value={editingTicket.laborCost}
                      onChange={(e) => setEditingTicket({...editingTicket, laborCost: parseFloat(e.target.value) || 0})}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Kasa Özeti */}
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Parça Maliyeti:</span>
                    <span>₺{calculateTotals().partsCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Parça Satış Toplamı:</span>
                    <span>₺{calculateTotals().partsTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>İşçilik Ücreti:</span>
                    <span>₺{calculateTotals().labor.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-900 border-t border-blue-200 pt-2 mb-1">
                    <span>Müşteriye Yansıyacak Toplam:</span>
                    <span>₺{calculateTotals().grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Net Kar (İşçilik + Parça Karı):</span>
                    <span>₺{calculateTotals().netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Manuel Tutar (Opsiyonel)</label>
                  <input 
                    type="text" 
                    value={editingTicket.price}
                    onChange={(e) => setEditingTicket({...editingTicket, price: e.target.value})}
                    placeholder="Otomatik hesaplanır"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                  <select 
                    value={editingTicket.status}
                    onChange={(e) => setEditingTicket({...editingTicket, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="in-progress">İşlemde</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingTicket(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Yeni Servis Kaydı</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTicket} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri</label>
                <div className="flex gap-2">
                  <select 
                    required
                    value={newTicket.customer}
                    onChange={(e) => setNewTicket({...newTicket, customer: e.target.value})}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Müşteri Seçin</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddCustomerOpen(true)}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Hızlı Müşteri Ekle"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cihaz Markası</label>
                  <select 
                    required
                    value={newTicket.deviceBrand}
                    onChange={(e) => setNewTicket({...newTicket, deviceBrand: e.target.value, deviceModel: ''})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cihaz Modeli</label>
                  <select 
                    required
                    value={newTicket.deviceModel}
                    onChange={(e) => setNewTicket({...newTicket, deviceModel: e.target.value})}
                    disabled={!newTicket.deviceBrand}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Seçiniz</option>
                    {brands.find(b => b.name === newTicket.deviceBrand)?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cihaz Türü</label>
                <select 
                  required
                  value={newTicket.deviceType}
                  onChange={(e) => setNewTicket({...newTicket, deviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="mobile">Cep Telefonu</option>
                  <option value="tablet">Tablet</option>
                  <option value="laptop">Laptop / Bilgisayar</option>
                  <option value="tv">Televizyon</option>
                  <option value="monitor">Monitör</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Arıza/İşlem</label>
                <textarea 
                  required
                  rows={3}
                  value={newTicket.issue}
                  onChange={(e) => setNewTicket({...newTicket, issue: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (Opsiyonel)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newTicket.price}
                    onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                  <select 
                    value={newTicket.status}
                    onChange={(e) => setNewTicket({...newTicket, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="in-progress">İşlemde</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kaydı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {isQuickAddCustomerOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Hızlı Müşteri Ekle</h3>
              <button 
                onClick={() => setIsQuickAddCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Adı / Ünvanı</label>
                <input 
                  type="text" 
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                  <input 
                    type="tel" 
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Tipi</label>
                  <select 
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Bireysel">Bireysel</option>
                    <option value="Kurumsal">Kurumsal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta (Opsiyonel)</label>
                <input 
                  type="email" 
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsQuickAddCustomerOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Müşteriyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
