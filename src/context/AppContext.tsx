import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

function useLocalStorageState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  React.useEffect(() => {
    try {
      if (state === null || state === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [state, setState];
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useLocalStorageState<Product[]>('ofisb_products', initialProducts);
  const [brands, setBrands] = useLocalStorageState<Brand[]>('ofisb_brands', initialBrands);
  const [customers, setCustomers] = useLocalStorageState<Customer[]>('ofisb_customers', initialCustomers);
  const [tickets, setTickets] = useLocalStorageState<Ticket[]>('ofisb_tickets', initialTickets);
  const [accounts, setAccounts] = useLocalStorageState<Account[]>('ofisb_accounts', initialAccounts);
  const [invoices, setInvoices] = useLocalStorageState<Invoice[]>('ofisb_invoices', initialInvoices);
  const [companySettings, setCompanySettings] = useLocalStorageState<CompanySettings>('ofisb_companySettings', initialCompanySettings);
  const [users, setUsers] = useLocalStorageState<UserRole[]>('ofisb_users', initialUsers);
  const [notificationSettings, setNotificationSettings] = useLocalStorageState<NotificationSettings>('ofisb_notificationSettings', initialNotificationSettings);
  const [securitySettings, setSecuritySettings] = useLocalStorageState<SecuritySettings>('ofisb_securitySettings', initialSecuritySettings);
  const [currentUser, setCurrentUser] = useLocalStorageState<UserRole | null>('ofisb_currentUser', null);
  const [adminPaymentSettings, setAdminPaymentSettings] = useLocalStorageState<AdminPaymentSettings>('ofisb_adminPaymentSettings', initialAdminPaymentSettings);
  const [subscriptionPackages, setSubscriptionPackages] = useLocalStorageState<SubscriptionPackage[]>('ofisb_subscriptionPackages', initialSubscriptionPackages);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync for Admin Settings and Users
  React.useEffect(() => {
    if (!firebaseUser) return;
    
    const unsubPayment = onSnapshot(doc(db, 'adminSettings', 'payment'), (docSnap) => {
      if (docSnap.exists()) {
        setAdminPaymentSettings(docSnap.data() as AdminPaymentSettings);
      }
    });

    const unsubPackages = onSnapshot(collection(db, 'subscriptionPackages'), (snapshot) => {
      const packages: SubscriptionPackage[] = [];
      snapshot.forEach((doc) => {
        packages.push({ id: doc.id, ...doc.data() } as SubscriptionPackage);
      });
      if (packages.length > 0) {
        setSubscriptionPackages(packages);
      }
    });

    let unsubUsers1 = () => {};
    let unsubUsers2 = () => {};

    // Try to fetch all users (will only succeed for Admin)
    try {
      unsubUsers1 = onSnapshot(collection(db, 'users'), (snapshot) => {
        const fetchedUsers: UserRole[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedUsers.push({ ...data, uid: doc.id } as UserRole & { uid: string });
        });
        if (fetchedUsers.length > 0) {
          setUsers(fetchedUsers);
        }
      }, (error) => {
        // If permission denied (not admin), just fetch current user
        if (error.code === 'permission-denied') {
          unsubUsers2 = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const user = { ...data, uid: docSnap.id } as UserRole & { uid: string };
              setCurrentUser(user);
              // Also update the users array with just this user so it's not empty
              setUsers([user]);
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
    }

    return () => {
      unsubPayment();
      unsubPackages();
      unsubUsers1();
      unsubUsers2();
    };
  }, [firebaseUser]);

  // Debounced save for adminPaymentSettings
  React.useEffect(() => {
    if (!firebaseUser) return;
    const timer = setTimeout(() => {
      setDoc(doc(db, 'adminSettings', 'payment'), adminPaymentSettings).catch(console.error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [adminPaymentSettings, firebaseUser]);

  // Debounced save for subscriptionPackages
  React.useEffect(() => {
    if (!firebaseUser) return;
    const timer = setTimeout(() => {
      subscriptionPackages.forEach(pkg => {
        const { id, ...data } = pkg;
        setDoc(doc(db, 'subscriptionPackages', id), data).catch(console.error);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [subscriptionPackages, firebaseUser]);

  React.useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser, setCurrentUser]);

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
