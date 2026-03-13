import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package, Tags, List, Filter, MoreVertical, X, Smartphone } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Mock Data
const initialCategories = [
  { id: 1, name: 'Kırtasiye', parent: '-', count: 0 },
  { id: 2, name: 'Elektronik', parent: '-', count: 0 },
  { id: 3, name: 'Bilgisayar Bileşenleri', parent: 'Elektronik', count: 0 },
  { id: 4, name: 'Sarf Malzeme', parent: '-', count: 0 },
  { id: 5, name: 'Hizmet', parent: '-', count: 0 },
];

const mockAttributes = [
  { id: 1, name: 'Renk', type: 'color', values: [
    { label: 'Siyah', hex: '#1e293b' }, 
    { label: 'Beyaz', hex: '#ffffff' }, 
    { label: 'Kırmızı', hex: '#ef4444' }, 
    { label: 'Mavi', hex: '#3b82f6' }
  ]},
  { id: 2, name: 'Beden / Ölçü', type: 'text', values: ['S', 'M', 'L', 'XL', 'Standart'] },
  { id: 3, name: 'Marka', type: 'text', values: ['Logitech', 'HP', 'Dell', 'Faber-Castell'] },
  { id: 4, name: 'Kapasite', type: 'text', values: ['16GB', '32GB', '64GB', '128GB'] },
];

export default function Products() {
  const { products, setProducts, brands, setBrands } = useAppContext();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'attributes' | 'brands'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isAddModelModalOpen, setIsAddModelModalOpen] = useState<number | null>(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'Kırtasiye',
    price: '',
    purchasePrice: '',
    stock: '',
    status: 'Aktif',
    manufacturerBrand: '',
    manufacturerModel: '',
    compatibleBrand: '',
    compatibleModel: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    parent: '-'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId !== null) {
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p,
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        price: parseFloat(newProduct.price) || 0,
        purchasePrice: parseFloat(newProduct.purchasePrice) || 0,
        stock: newProduct.stock === '' ? null : parseInt(newProduct.stock, 10),
        status: newProduct.status,
        manufacturerBrand: newProduct.manufacturerBrand || '-',
        manufacturerModel: newProduct.manufacturerModel || '-',
        compatibleBrand: newProduct.compatibleBrand || '-',
        compatibleModel: newProduct.compatibleModel || '-'
      } : p));
    } else {
      const productToAdd = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        price: parseFloat(newProduct.price) || 0,
        purchasePrice: parseFloat(newProduct.purchasePrice) || 0,
        stock: newProduct.stock === '' ? null : parseInt(newProduct.stock, 10),
        status: newProduct.status,
        manufacturerBrand: newProduct.manufacturerBrand || '-',
        manufacturerModel: newProduct.manufacturerModel || '-',
        compatibleBrand: newProduct.compatibleBrand || '-',
        compatibleModel: newProduct.compatibleModel || '-'
      };
      setProducts([...products, productToAdd]);
    }
    closeProductModal();
  };

  const closeProductModal = () => {
    setIsAddModalOpen(false);
    setEditingProductId(null);
    setNewProduct({ name: '', sku: '', category: 'Kırtasiye', price: '', purchasePrice: '', stock: '', status: 'Aktif', manufacturerBrand: '', manufacturerModel: '', compatibleBrand: '', compatibleModel: '' });
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      purchasePrice: product.purchasePrice.toString(),
      stock: product.stock === null ? '' : product.stock.toString(),
      status: product.status,
      manufacturerBrand: product.manufacturerBrand === '-' ? '' : product.manufacturerBrand,
      manufacturerModel: product.manufacturerModel === '-' ? '' : product.manufacturerModel,
      compatibleBrand: product.compatibleBrand === '-' ? '' : product.compatibleBrand,
      compatibleModel: product.compatibleModel === '-' ? '' : product.compatibleModel
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryToAdd = {
      id: categories.length + 1,
      name: newCategory.name,
      parent: newCategory.parent,
      count: 0
    };
    setCategories([...categories, categoryToAdd]);
    setIsAddCategoryModalOpen(false);
    setNewCategory({ name: '', parent: '-' });
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setBrands([...brands, { id: brands.length + 1, name: newBrandName, models: [] }]);
    setIsAddBrandModalOpen(false);
    setNewBrandName('');
  };

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim() || isAddModelModalOpen === null) return;
    setBrands(brands.map(b => b.id === isAddModelModalOpen ? { ...b, models: [...b.models, newModelName] } : b));
    setIsAddModelModalOpen(null);
    setNewModelName('');
  };

  const renderProducts = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Ürün/Hizmet Adı</th>
              <th className="px-6 py-4 font-medium">Barkod/SKU</th>
              <th className="px-6 py-4 font-medium">Kategori</th>
              <th className="px-6 py-4 font-medium">Üretici</th>
              <th className="px-6 py-4 font-medium">Uyumlu Cihaz</th>
              <th className="px-6 py-4 font-medium text-right">Alış Fiyatı</th>
              <th className="px-6 py-4 font-medium text-right">Satış Fiyatı</th>
              <th className="px-6 py-4 font-medium text-right">Stok</th>
              <th className="px-6 py-4 font-medium">Durum</th>
              <th className="px-6 py-4 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                <td className="px-6 py-4 text-slate-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {product.manufacturerBrand !== '-' || product.manufacturerModel !== '-' ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{product.manufacturerBrand}</span>
                      <span className="text-xs">{product.manufacturerModel}</span>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {product.compatibleBrand !== '-' || product.compatibleModel !== '-' ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{product.compatibleBrand}</span>
                      <span className="text-xs">{product.compatibleModel}</span>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-500">
                  ₺{product.purchasePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right">
                  {product.stock === null ? (
                    <span className="text-slate-400">-</span>
                  ) : (
                    <span className={`font-medium ${product.stock < 30 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {product.stock}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Kategori Adı</th>
              <th className="px-6 py-4 font-medium">Üst Kategori</th>
              <th className="px-6 py-4 font-medium text-right">Ürün Sayısı</th>
              <th className="px-6 py-4 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                  <Tags size={16} className="text-slate-400" />
                  {category.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{category.parent}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {category.count} Ürün
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAttributes = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium w-1/4">Özellik Adı</th>
              <th className="px-6 py-4 font-medium">Değerler (Varyantlar)</th>
              <th className="px-6 py-4 font-medium text-right w-32">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockAttributes.map((attr) => (
              <tr key={attr.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{attr.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val: any, idx) => {
                      if (attr.type === 'color') {
                        return (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <span className="w-3 h-3 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: val.hex }}></span>
                            {val.label}
                          </span>
                        );
                      }
                      return (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {val}
                        </span>
                      );
                    })}
                    <button className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white text-blue-600 border border-dashed border-blue-300 hover:bg-blue-50 transition-colors">
                      <Plus size={12} className="mr-1" /> Değer Ekle
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBrands = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium w-1/4">Marka Adı</th>
              <th className="px-6 py-4 font-medium">Modeller</th>
              <th className="px-6 py-4 font-medium text-right w-32">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{brand.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {brand.models.map((model, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {model}
                      </span>
                    ))}
                    <button 
                      onClick={() => setIsAddModelModalOpen(brand.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white text-blue-600 border border-dashed border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={12} className="mr-1" /> Model Ekle
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ürünler ve Hizmetler</h1>
          <p className="text-slate-500 text-sm mt-1">Envanter, kategori ve ürün özelliklerinizi yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={16} />
            Dışa Aktar
          </button>
          <button 
            onClick={() => {
              if (activeTab === 'products') {
                setEditingProductId(null);
                setNewProduct({ name: '', sku: '', category: 'Kırtasiye', price: '', purchasePrice: '', stock: '', status: 'Aktif', manufacturerBrand: '', manufacturerModel: '', compatibleBrand: '', compatibleModel: '' });
                setIsAddModalOpen(true);
              }
              if (activeTab === 'categories') setIsAddCategoryModalOpen(true);
              if (activeTab === 'brands') setIsAddBrandModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus size={16} />
            {activeTab === 'products' && 'Yeni Ürün Ekle'}
            {activeTab === 'categories' && 'Yeni Kategori Ekle'}
            {activeTab === 'brands' && 'Yeni Marka Ekle'}
            {activeTab === 'attributes' && 'Yeni Özellik Ekle'}
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'products' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Package size={18} />
            Ürün Listesi
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'categories' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Tags size={18} />
            Kategoriler
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'brands' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Smartphone size={18} />
            Marka & Modeller
          </button>
          <button
            onClick={() => setActiveTab('attributes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'attributes' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <List size={18} />
            Özellikler & Varyantlar
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'brands' && renderBrands()}
        {activeTab === 'attributes' && renderAttributes()}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingProductId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <button 
                onClick={closeProductModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Adı</label>
                <input 
                  type="text" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Barkod/SKU</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {categories.filter(c => c.parent === '-').map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Üretici Marka (Opsiyonel)</label>
                  <select 
                    value={newProduct.manufacturerBrand}
                    onChange={(e) => setNewProduct({...newProduct, manufacturerBrand: e.target.value, manufacturerModel: ''})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Üretici Model (Opsiyonel)</label>
                  <select 
                    value={newProduct.manufacturerModel}
                    onChange={(e) => setNewProduct({...newProduct, manufacturerModel: e.target.value})}
                    disabled={!newProduct.manufacturerBrand}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Seçiniz</option>
                    {brands.find(b => b.name === newProduct.manufacturerBrand)?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Uyumlu Marka (Opsiyonel)</label>
                  <select 
                    value={newProduct.compatibleBrand}
                    onChange={(e) => setNewProduct({...newProduct, compatibleBrand: e.target.value, compatibleModel: ''})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Uyumlu Model (Opsiyonel)</label>
                  <select 
                    value={newProduct.compatibleModel}
                    onChange={(e) => setNewProduct({...newProduct, compatibleModel: e.target.value})}
                    disabled={!newProduct.compatibleBrand}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Seçiniz</option>
                    {brands.find(b => b.name === newProduct.compatibleBrand)?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alış Fiyatı (₺)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={newProduct.purchasePrice}
                    onChange={(e) => setNewProduct({...newProduct, purchasePrice: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Satış Fiyatı (₺)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stok (Opsiyonel)</label>
                  <input 
                    type="number" 
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                <select 
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                  <option value="Kritik Stok">Kritik Stok</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={closeProductModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProductId ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Yeni Kategori Ekle</h3>
              <button 
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Adı</label>
                <input 
                  type="text" 
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Üst Kategori</label>
                <select 
                  value={newCategory.parent}
                  onChange={(e) => setNewCategory({...newCategory, parent: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="-">Ana Kategori (Yok)</option>
                  {categories.filter(c => c.parent === '-').map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kategoriyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddBrandModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Yeni Marka Ekle</h3>
              <button 
                onClick={() => setIsAddBrandModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBrand} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marka Adı</label>
                <input 
                  type="text" 
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddBrandModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Markayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Model Modal */}
      {isAddModelModalOpen !== null && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {brands.find(b => b.id === isAddModelModalOpen)?.name} için Model Ekle
              </h3>
              <button 
                onClick={() => setIsAddModelModalOpen(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddModel} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model Adı</label>
                <input 
                  type="text" 
                  required
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddModelModalOpen(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modeli Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
