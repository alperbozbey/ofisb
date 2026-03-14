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
  subscriptionPackageId?: string;
};

export type AdminPaymentSettings = {
  iban: string;
  bankName: string;
  accountHolder: string;
  monthlyPrice: number; // Keeping this for backward compatibility if needed, but we'll use packages
  notes: string;
};

export type SubscriptionPackage = {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  isActive: boolean;
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
  subscriptionPackages: SubscriptionPackage[];
  setSubscriptionPackages: React.Dispatch<React.SetStateAction<SubscriptionPackage[]>>;
};

const initialAccounts: Account[] = [];

const initialTickets: Ticket[] = [];

const initialCustomers: Customer[] = [];

const initialBrands: Brand[] = [];

const initialProducts: Product[] = [];

const initialInvoices: Invoice[] = [];

const initialCompanySettings: CompanySettings = {
  companyName: 'Yeni Şirket',
  email: '',
  phone: '',
  address: '',
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
  }
];

const initialAdminPaymentSettings: AdminPaymentSettings = {
  iban: '',
  bankName: '',
  accountHolder: '',
  monthlyPrice: 499,
  notes: 'Lütfen ödeme açıklamanıza kullanıcı adınızı yazmayı unutmayın.'
};

const initialSubscriptionPackages: SubscriptionPackage[] = [
  {
    id: 'pkg-1',
    name: 'Aylık Plan',
    price: 499,
    durationMonths: 1,
    features: ['Sınırsız kullanıcı', 'Tüm özellikler', 'Öncelikli destek'],
    isActive: true
  },
  {
    id: 'pkg-2',
    name: 'Yıllık Plan',
    price: 4990,
    durationMonths: 12,
    features: ['Sınırsız kullanıcı', 'Tüm özellikler', 'Öncelikli destek', '2 Ay Bizden'],
    isActive: true
  }
];

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
  const [users, setUsers] = useState<UserRole[]>(() => {
    const saved = localStorage.getItem('ofisb_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialUsers;
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
  const [currentUser, setCurrentUser] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('ofisb_currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  React.useEffect(() => {
    localStorage.setItem('ofisb_users', JSON.stringify(users));
    
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser]);

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ofisb_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ofisb_currentUser');
    }
  }, [currentUser]);
  const [adminPaymentSettings, setAdminPaymentSettings] = useState<AdminPaymentSettings>(initialAdminPaymentSettings);
  const [subscriptionPackages, setSubscriptionPackages] = useState<SubscriptionPackage[]>(initialSubscriptionPackages);

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
      adminPaymentSettings, setAdminPaymentSettings,
      subscriptionPackages, setSubscriptionPackages
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
