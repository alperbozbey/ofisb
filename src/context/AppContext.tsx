import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Account = {
  id: number;
  name: string;
  type: 'cash' | 'bank' | 'credit';
  currency: string;
  balance: number;
  bank: string | null;
  branch: string | null;
  iban: string | null;
};

export type Brand = {
  id: number;
  name: string;
  models: string[];
};

export type Customer = {
  id: number;
  name: string;
  type: string;
  group: string;
  contact: string;
  phone: string;
  email: string;
  balance: string;
  status: string;
};

export type UsedPart = {
  id: string;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  purchasePrice: number;
};

export type Ticket = {
  id: string;
  customer: string;
  device: string;
  deviceType: string;
  issue: string;
  status: string;
  date: string;
  price: string;
  laborCost?: number;
  usedParts?: UsedPart[];
  netProfit?: number;
  partsCost?: number;
  isPaid?: boolean;
};

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

export type InvoiceType = 'sale' | 'purchase';

export type Invoice = {
  id: string;
  type: InvoiceType;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
};

export type CompanySettings = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
};

export type UserRole = {
  id: number;
  username?: string;
  password?: string;
  name: string;
  email: string;
  role: 'Admin' | 'Kullanıcı';
  status: 'Aktif' | 'Pasif';
  subscriptionEndDate?: string;
};

export type AdminPaymentSettings = {
  iban: string;
  bankName: string;
  accountHolder: string;
  monthlyPrice: number;
  notes: string;
};

export type NotificationSettings = {
  emailInvoices: boolean;
  smsAlerts: boolean;
  marketingEmails: boolean;
};

export type SecuritySettings = {
  twoFactorAuth: boolean;
  passwordLastChanged: string;
};

type AppContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProductStockAndPrice: (productId: number, newStock: number, newPurchasePrice: number) => void;
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  addIncomeToAccount: (accountId: number, amount: number) => void;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  companySettings: CompanySettings;
  setCompanySettings: React.Dispatch<React.SetStateAction<CompanySettings>>;
  users: UserRole[];
  setUsers: React.Dispatch<React.SetStateAction<UserRole[]>>;
  notificationSettings: NotificationSettings;
  setNotificationSettings: React.Dispatch<React.SetStateAction<NotificationSettings>>;
  securitySettings: SecuritySettings;
  setSecuritySettings: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  currentUser: UserRole | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserRole | null>>;
  adminPaymentSettings: AdminPaymentSettings;
  setAdminPaymentSettings: React.Dispatch<React.SetStateAction<AdminPaymentSettings>>;
};

const initialAccounts: Account[] = [
  { id: 1, name: 'Merkez Kasa', type: 'cash', currency: 'TRY', balance: 12450.00, bank: null, branch: null, iban: null },
  { id: 2, name: 'Garanti BBVA Ticari', type: 'bank', currency: 'TRY', balance: 45200.00, bank: 'Garanti BBVA', branch: 'Kadıköy', iban: 'TR12 0006 2000 0001 2345 6789 01' },
  { id: 3, name: 'Ziraat Bankası USD', type: 'bank', currency: 'USD', balance: 4250.00, bank: 'Ziraat Bankası', branch: 'Beşiktaş', iban: 'TR34 0001 0000 0009 8765 4321 02' },
  { id: 4, name: 'Şirket Kredi Kartı', type: 'credit', currency: 'TRY', balance: -15300.00, bank: 'Yapı Kredi', branch: null, iban: '**** **** **** 4567' },
];

const initialTickets: Ticket[] = [
  { 
    id: 'TS-2023-001', 
    customer: 'Ahmet Yılmaz', 
    device: 'iPhone 13 Pro', 
    deviceType: 'mobile',
    issue: 'Ekran Kırık, Dokunmatik Çalışmıyor', 
    status: 'pending', 
    date: '12 Eki 2023', 
    price: '₺3.500,00',
    laborCost: 1000,
    usedParts: []
  },
  { 
    id: 'TS-2023-002', 
    customer: 'XYZ Ltd. Şti.', 
    device: 'Dell XPS 15', 
    deviceType: 'laptop',
    issue: 'Batarya Değişimi ve Bakım', 
    status: 'in-progress', 
    date: '11 Eki 2023', 
    price: '₺1.200,00',
    laborCost: 500,
    usedParts: []
  },
  { 
    id: 'TS-2023-003', 
    customer: 'Ayşe Demir', 
    device: 'Samsung 55" 4K TV', 
    deviceType: 'tv',
    issue: 'Görüntü Gidip Geliyor', 
    status: 'completed', 
    date: '09 Eki 2023', 
    price: '₺850,00',
    laborCost: 850,
    usedParts: []
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

const initialCustomers: Customer[] = [
  { id: 1, name: 'ABC Teknoloji A.Ş.', type: 'Kurumsal', group: 'Tedarikçi', contact: 'Ahmet Yılmaz', phone: '0532 123 45 67', email: 'ahmet@abcteknoloji.com', balance: '₺12.500,00', status: 'active' },
  { id: 2, name: 'XYZ Yazılım Ltd.', type: 'Kurumsal', group: 'Toptan', contact: 'Ayşe Demir', phone: '0555 987 65 43', email: 'ayse@xyzyazilim.com', balance: '-₺4.200,00', status: 'active' },
  { id: 3, name: 'Ofis Kırtasiye', type: 'Bireysel', group: 'Perakende', contact: 'Mehmet Kaya', phone: '0544 555 44 33', email: 'info@ofiskirtasiye.com', balance: '₺0,00', status: 'inactive' },
  { id: 4, name: 'Global Lojistik', type: 'Kurumsal', group: 'Toptan', contact: 'Zeynep Çelik', phone: '0533 222 11 00', email: 'zeynep@globallojistik.com', balance: '₺28.400,00', status: 'active' },
  { id: 5, name: 'Mega Market', type: 'Kurumsal', group: 'Perakende', contact: 'Ali Can', phone: '0505 666 77 88', email: 'ali@megamarket.com', balance: '₺3.150,00', status: 'active' },
];

const initialBrands: Brand[] = [
  { id: 1, name: 'Apple', models: ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'] },
  { id: 2, name: 'Samsung', models: ['Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy A54'] },
  { id: 3, name: 'Logitech', models: ['M185', 'MX Master 3', 'G Pro X'] },
  { id: 4, name: 'SanDisk', models: ['Cruzer Blade', 'Ultra Flair', 'Extreme Pro'] },
];

const initialProducts: Product[] = [
  { id: 1, name: 'A4 Fotokopi Kağıdı', sku: 'KRT-001', category: 'Kırtasiye', price: 120.00, purchasePrice: 80.00, stock: 150, status: 'Aktif', manufacturerBrand: '-', manufacturerModel: '-', compatibleBrand: '-', compatibleModel: '-' },
  { id: 2, name: 'Tükenmez Kalem Mavi', sku: 'KRT-002', category: 'Kırtasiye', price: 15.50, purchasePrice: 5.00, stock: 300, status: 'Aktif', manufacturerBrand: '-', manufacturerModel: '-', compatibleBrand: '-', compatibleModel: '-' },
  { id: 3, name: 'Kablosuz Mouse', sku: 'ELK-001', category: 'Elektronik', price: 350.00, purchasePrice: 200.00, stock: 20, status: 'Aktif', manufacturerBrand: 'Logitech', manufacturerModel: 'M185', compatibleBrand: 'Logitech', compatibleModel: 'M185' },
  { id: 4, name: 'USB Bellek 64GB', sku: 'ELK-002', category: 'Elektronik', price: 220.00, purchasePrice: 120.00, stock: 35, status: 'Kritik Stok', manufacturerBrand: 'SanDisk', manufacturerModel: 'Cruzer Blade', compatibleBrand: '-', compatibleModel: '-' },
  { id: 5, name: 'Teknik Servis Saati', sku: 'HZM-001', category: 'Hizmet', price: 500.00, purchasePrice: 0, stock: null, status: 'Aktif', manufacturerBrand: '-', manufacturerModel: '-', compatibleBrand: '-', compatibleModel: '-' },
  { id: 6, name: 'iPhone 13 Ekran', sku: 'YDK-001', category: 'Yedek Parça', price: 2500.00, purchasePrice: 1500.00, stock: 10, status: 'Aktif', manufacturerBrand: 'Apple', manufacturerModel: 'iPhone 13', compatibleBrand: 'Apple', compatibleModel: 'iPhone 13' },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-2024-001', type: 'sale', customer: 'ABC Teknoloji A.Ş.', date: '12 Eki 2024', dueDate: '12 Kas 2024', amount: '₺12.500,00', status: 'paid' },
  { id: 'INV-2024-002', type: 'sale', customer: 'XYZ Yazılım Ltd.', date: '15 Eki 2024', dueDate: '15 Kas 2024', amount: '₺4.200,00', status: 'pending' },
  { id: 'INV-2024-003', type: 'sale', customer: 'Ofis Kırtasiye', date: '01 Eyl 2024', dueDate: '01 Eki 2024', amount: '₺850,00', status: 'overdue' },
  { id: 'INV-2024-004', type: 'sale', customer: 'Global Lojistik', date: '20 Eki 2024', dueDate: '20 Kas 2024', amount: '₺28.400,00', status: 'pending' },
  { id: 'INV-2024-005', type: 'sale', customer: 'Mega Market', date: '05 Eki 2024', dueDate: '05 Kas 2024', amount: '₺3.150,00', status: 'paid' },
];

const initialCompanySettings: CompanySettings = {
  companyName: 'Ofisb Teknoloji A.Ş.',
  email: 'info@ofisb.com',
  phone: '+90 (555) 123 45 67',
  address: 'Levent Mah. Çiçek Sok. No:1 Beşiktaş/İstanbul',
  currency: 'TRY',
  taxRate: 20,
};

const initialUsers: UserRole[] = [
  { 
    id: 1, 
    username: 'alper',
    password: 'Monkmage13.',
    name: 'Alper', 
    email: 'alper@ofisb.com', 
    role: 'Admin', 
    status: 'Aktif',
    subscriptionEndDate: '2030-12-31'
  },
  { 
    id: 2, 
    username: 'demo',
    password: '123',
    name: 'Demo Kullanıcı', 
    email: 'demo@ofisb.com', 
    role: 'Kullanıcı', 
    status: 'Aktif',
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 month from now
  },
];

const initialAdminPaymentSettings: AdminPaymentSettings = {
  iban: 'TR12 0006 2000 0001 2345 6789 01',
  bankName: 'Garanti BBVA',
  accountHolder: 'Ofisb Teknoloji A.Ş.',
  monthlyPrice: 499,
  notes: 'Lütfen ödeme açıklamanıza kullanıcı adınızı yazmayı unutmayın. Ödemeniz onaylandıktan sonra hesabınız otomatik olarak aktif edilecektir.'
};

const initialNotificationSettings: NotificationSettings = {
  emailInvoices: true,
  smsAlerts: false,
  marketingEmails: false,
};

const initialSecuritySettings: SecuritySettings = {
  twoFactorAuth: false,
  passwordLastChanged: '12 Eki 2023',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(initialCompanySettings);
  const [users, setUsers] = useState<UserRole[]>(initialUsers);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
  const [adminPaymentSettings, setAdminPaymentSettings] = useState<AdminPaymentSettings>(initialAdminPaymentSettings);

  const addIncomeToAccount = (accountId: number, amount: number) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, balance: acc.balance + amount } : acc
    ));
  };

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
    <AppContext.Provider value={{ 
      products, setProducts, updateProductStockAndPrice, 
      brands, setBrands, 
      customers, setCustomers, 
      tickets, setTickets,
      accounts, setAccounts, addIncomeToAccount,
      invoices, setInvoices,
      companySettings, setCompanySettings,
      users, setUsers,
      notificationSettings, setNotificationSettings,
      securitySettings, setSecuritySettings,
      currentUser, setCurrentUser,
      adminPaymentSettings, setAdminPaymentSettings
    }}>
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
