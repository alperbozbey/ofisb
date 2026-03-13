import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  purchasePrice: number;
  stock: number | null;
  status: string;
  manufacturerBrand: string;
  manufacturerModel: string;
  compatibleBrand: string;
  compatibleModel: string;
};

type AppContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProductStockAndPrice: (productId: number, newStock: number, newPurchasePrice: number) => void;
};

const initialProducts: Product[] = [
  { id: 1, name: 'A4 Fotokopi Kağıdı', sku: 'KRT-001', category: 'Kırtasiye', price: 120.00, purchasePrice: 80.00, stock: 150, status: 'Aktif', manufacturerBrand: '-', manufacturerModel: '-', compatibleBrand: '-', compatibleModel: '-' },
  { id: 2, name: 'Tükenmez Kalem Mavi', sku: 'KRT-002', category: 'Kırtasiye', price: 15.50, purchasePrice: 5.00, stock: 300, status: 'Aktif', manufacturerBrand: '-', manufacturerModel: '-', compatibleBrand: '-', compatibleModel: '-' },
  { id: 3, name: 'Kablosuz Mouse', sku: 'ELK-001', category: 'Elektronik', price: 350.00, purchasePrice: 200.00, stock: 20, status: 'Aktif', manufacturerBrand: 'Logitech', manufacturerModel: 'M185', compatibleBrand: 'Logitech', compatibleModel: 'M185' },
  { id: 4, name: 'USB Bellek 64GB', sku: 'ELK-002', category: 'Elektronik', price: 220.00, purchasePrice: 120.00, stock: 35, status: 'Kritik Stok', manufacturerBrand: 'SanDisk', manufacturerModel: 'Cruzer Blade', compatibleBrand: '-', compatibleModel: '-' },
  { id: 5, name: 'Teknik Servis Saati', sku: 'HZM-001', category: 'Hizmet', price: 500.00, purchasePrice: 0, stock: null, status: 'Aktif', manufacturerBrand: '-', manufacturerModel: '-', compatibleBrand: '-', compatibleModel: '-' },
  { id: 6, name: 'iPhone 13 Ekran', sku: 'YDK-001', category: 'Yedek Parça', price: 2500.00, purchasePrice: 1500.00, stock: 10, status: 'Aktif', manufacturerBrand: 'Apple', manufacturerModel: 'iPhone 13', compatibleBrand: 'Apple', compatibleModel: 'iPhone 13' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProductStockAndPrice = (productId: number, addedStock: number, newPurchasePrice: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: p.stock !== null ? p.stock + addedStock : null,
          purchasePrice: newPurchasePrice
        };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{ products, setProducts, updateProductStockAndPrice }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
