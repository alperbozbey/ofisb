import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, User, ShoppingCart, Tag, Receipt } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Mock Data
const categories = ['Tümü', 'Kırtasiye', 'Elektronik', 'Sarf Malzeme', 'Hizmet'];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
}

export default function QuickSale() {
  const { products } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('Perakende Müşteri');

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart Functions
  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, taxRate: 20 }]; // Assuming 20% tax for all for now
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm('Sepeti temizlemek istediğinize emin misiniz?')) {
      setCart([]);
    }
  };

  // Calculations
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxTotal = cart.reduce((sum, item) => sum + ((item.price * item.quantity * item.taxRate) / 100), 0);
  const grandTotal = subTotal + taxTotal;

  const handlePayment = (method: string) => {
    if (cart.length === 0) {
      alert('Sepet boş!');
      return;
    }
    alert(`${grandTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} tutarındaki satış ${method} olarak kaydedildi.`);
    setCart([]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Panel: Products */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Ürün adı veya barkod okutun..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col h-full active:scale-95"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
                  <Tag size={20} />
                </div>
                <h3 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1 flex-1">
                  {product.name}
                </h3>
                <div className="mt-auto pt-2 flex items-center justify-between w-full">
                  <span className="text-lg font-bold text-blue-600">
                    ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    Stok: {product.stock !== null ? product.stock : 'Sınırsız'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        {/* Customer Selection */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <button className="w-full flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 font-medium">Müşteri</p>
                <p className="text-sm font-semibold text-slate-900">{selectedCustomer}</p>
              </div>
            </div>
            <Search size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Sepetiniz şu an boş</p>
              <p className="text-sm mt-1">Sol taraftan ürün ekleyebilirsiniz</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-900">Sepet ({cart.length} Ürün)</h3>
                <button 
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} /> Temizle
                </button>
              </div>
              
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                    <div className="text-sm font-semibold text-blue-600 mt-1">
                      ₺{(item.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Payment */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Ara Toplam</span>
              <span>₺{subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>KDV Toplamı</span>
              <span>₺{taxTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Genel Toplam</span>
              <span>₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handlePayment('Nakit')}
              disabled={cart.length === 0}
              className="flex flex-col items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white p-3 rounded-xl transition-colors font-medium text-sm"
            >
              <Banknote size={20} />
              Nakit
            </button>
            <button 
              onClick={() => handlePayment('Kredi Kartı')}
              disabled={cart.length === 0}
              className="flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-3 rounded-xl transition-colors font-medium text-sm text-center leading-tight"
            >
              <CreditCard size={20} />
              Kredi Kartı
            </button>
            <button 
              onClick={() => handlePayment('Açık Hesap')}
              disabled={cart.length === 0}
              className="flex flex-col items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white p-3 rounded-xl transition-colors font-medium text-sm text-center leading-tight"
            >
              <Receipt size={20} />
              Açık Hesap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
