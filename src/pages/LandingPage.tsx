import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  CheckCircle2, Lock, BarChart3, Users, Wrench, 
  Wallet, Shield, Zap, ChevronRight, Menu, X, 
  FileText, Box, Calculator, ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { users, setUsers, setCurrentUser } = useAppContext();
  
  // UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
    } else {
      setError('Hatalı kullanıcı adı veya şifre.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !email || !name) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    if (users.some(u => u.username === username)) {
      setError('Bu kullanıcı adı zaten alınmış.');
      return;
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      username,
      password,
      name,
      email,
      role: 'Kullanıcı' as const,
      status: 'Aktif' as const,
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setUsers([...users, newUser]);
    setAuthModal('login');
    setError('');
    alert('Hesabınız oluşturuldu. 1 aylık ücretsiz deneme süreniz başladı. Lütfen giriş yapın.');
  };

  const resetForms = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setName('');
    setError('');
  };

  const openModal = (type: 'login' | 'register') => {
    resetForms();
    setAuthModal(type);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-slate-900">ofisb</span>
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#ozellikler" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Özellikler</a>
              <a href="#nasil-calisir" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Nasıl Çalışır?</a>
              <a href="#seo-icerik" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Neden Biz?</a>
              <div className="flex items-center gap-4 ml-4">
                <button onClick={() => openModal('login')} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                  Giriş Yap
                </button>
                <button onClick={() => openModal('register')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                  Ücretsiz Dene
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-lg py-4 px-4 flex flex-col gap-4">
            <a href="#ozellikler" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Özellikler</a>
            <a href="#nasil-calisir" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Nasıl Çalışır?</a>
            <a href="#seo-icerik" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Neden Biz?</a>
            <div className="h-px bg-slate-100 my-2"></div>
            <button onClick={() => openModal('login')} className="w-full text-left px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">Giriş Yap</button>
            <button onClick={() => openModal('register')} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-center">Ücretsiz Dene</button>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 blur-[100px] rounded-full mix-blend-multiply"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              İşletmenizi büyütmenin en kolay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ön muhasebe programı</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Fatura kesme, stok takibi, cari hesap yönetimi ve teknik servis süreçlerinizi tek bir bulut tabanlı platformdan yönetin. KOBİ'ler için özel olarak tasarlandı.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => openModal('register')} className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2">
                Hemen Ücretsiz Başla <ArrowRight size={20} />
              </button>
              <button onClick={() => openModal('login')} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-lg font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Zaten hesabım var
              </button>
            </div>
            <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Kredi kartı gerekmez
              <span className="mx-2">•</span>
              <CheckCircle2 size={16} className="text-emerald-500" /> 30 gün ücretsiz deneme
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section id="ozellikler" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tüm İhtiyaçlarınız Tek Platformda</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">İşletmenizin finansal ve operasyonel süreçlerini dijitalleştirin, zamandan tasarruf edin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: FileText, title: 'Hızlı Fatura Kesme', desc: 'Saniyeler içinde profesyonel faturalar oluşturun, müşterilerinize PDF olarak gönderin ve tahsilatlarınızı takip edin.' },
                { icon: Box, title: 'Gelişmiş Stok Takibi', desc: 'Ürünlerinizin depo durumunu, alış/satış fiyatlarını ve kritik stok seviyelerini anlık olarak izleyin.' },
                { icon: Users, title: 'Cari Hesap Yönetimi', desc: 'Müşteri ve tedarikçi bakiyelerini, hesap ekstrelerini ve ödeme geçmişlerini tek ekranda görüntüleyin.' },
                { icon: Wrench, title: 'Teknik Servis Programı', desc: 'Cihaz kabulünden teslimata kadar tüm servis süreçlerini, kullanılan yedek parçaları ve işçilik ücretlerini yönetin.' },
                { icon: Wallet, title: 'Kasa ve Banka Takibi', desc: 'Nakit, kredi kartı ve banka hesaplarınızdaki tüm para giriş çıkışlarını detaylı olarak raporlayın.' },
                { icon: BarChart3, title: 'Detaylı Raporlama', desc: 'İşletmenizin karlılık durumunu, en çok satan ürünleri ve gelir-gider analizlerini grafiklerle inceleyin.' },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Rich Content Section */}
        <section id="seo-icerik" className="py-20 bg-slate-900 text-slate-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Neden Ofisb Ön Muhasebe Programı Kullanmalısınız?</h2>
            
            <div className="space-y-8 text-lg leading-relaxed">
              <p>
                Günümüzün rekabetçi iş dünyasında, KOBİ'ler ve büyüyen işletmeler için finansal süreçleri manuel olarak yönetmek hem zaman kaybı hem de hata riskini beraberinde getirir. <strong>Bulut tabanlı ön muhasebe programı</strong> Ofisb, işletmenizin tüm finansal operasyonlarını dijitalleştirerek size hız ve güvenilirlik kazandırır.
              </p>
              
              <h3 className="text-2xl font-bold text-white mt-12 mb-4">Online Ön Muhasebe ile Mekandan Bağımsız Yönetim</h3>
              <p>
                Geleneksel masaüstü yazılımlarının aksine, Ofisb <strong>online ön muhasebe programı</strong> olarak çalışır. İnternet bağlantısı olan herhangi bir cihazdan (bilgisayar, tablet veya akıllı telefon) sisteme giriş yapabilir, <strong>fatura kesme programı</strong> özelliklerini kullanarak sahadayken bile müşterilerinize anında fatura gönderebilirsiniz.
              </p>

              <h3 className="text-2xl font-bold text-white mt-12 mb-4">Kapsamlı Stok Takip Programı ve Depo Yönetimi</h3>
              <p>
                Ticari işletmelerin en büyük zorluklarından biri envanter yönetimidir. Ofisb'nin entegre <strong>stok takip programı</strong> sayesinde ürünlerinizin giriş-çıkışlarını anlık olarak izleyebilir, kritik stok seviyesi uyarıları alarak yok satma riskini ortadan kaldırabilirsiniz. Barkod desteği ve varyant yönetimi ile deponuz her zaman kontrol altında olur.
              </p>

              <h3 className="text-2xl font-bold text-white mt-12 mb-4">Teknik Servis Yazılımı ile Müşteri Memnuniyeti</h3>
              <p>
                Tamir, bakım ve onarım hizmeti veren işletmeler için standart bir muhasebe yazılımı yeterli olmaz. Ofisb, içerisinde barındırdığı özel <strong>teknik servis programı</strong> modülü ile cihaz kabul fişi oluşturma, durum takibi, teknisyen atama ve kullanılan yedek parçaların stoktan otomatik düşülmesi gibi sektörel ihtiyaçlara tam çözüm sunar.
              </p>

              <h3 className="text-2xl font-bold text-white mt-12 mb-4">Gelir Gider Takibi ve Cari Hesap Programı</h3>
              <p>
                İşletmenizin nakit akışını sağlıklı yönetmek için kimden ne kadar alacağınız olduğunu ve kime ne kadar borcunuz olduğunu bilmeniz gerekir. Gelişmiş <strong>cari hesap tutma programı</strong> özelliklerimizle müşteri ve tedarikçi bakiyelerini anlık görebilir, <strong>gelir gider takibi</strong> yaparak şirketinizin karlılığını detaylı raporlarla analiz edebilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">İşletmenizi Dijitalleştirmeye Hazır Mısınız?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Kurulum gerektirmeyen, kullanımı kolay ve güvenli ön muhasebe programımızı 30 gün boyunca ücretsiz deneyin.
            </p>
            <button onClick={() => openModal('register')} className="px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all shadow-lg hover:scale-105">
              Hemen Ücretsiz Hesap Oluştur
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className="text-xl font-bold text-white">ofisb</span>
              </div>
              <p className="text-sm max-w-sm">
                KOBİ'ler için geliştirilmiş yeni nesil bulut tabanlı ön muhasebe, stok takip ve teknik servis yönetim platformu.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Özellikler</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Ön Muhasebe Programı</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fatura Kesme Programı</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Stok Takip Programı</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cari Hesap Yönetimi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Teknik Servis Yazılımı</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm">
                <li>destek@ofisb.com</li>
                <li>+90 (850) 123 45 67</li>
                <li>Levent, İstanbul</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Ofisb Teknoloji A.Ş. Tüm hakları saklıdır.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {authModal === 'login' ? 'Giriş Yap' : 'Ücretsiz Kayıt Ol'}
              </h3>
              <button onClick={() => setAuthModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-start gap-2">
                  <Shield size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={authModal === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {authModal === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad / Firma Adı</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: Ahmet Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ornek@sirket.com"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Adı</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kullanıcı adınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  {authModal === 'login' ? (
                    <><Lock size={18} /> Sisteme Giriş Yap</>
                  ) : (
                    <><Zap size={18} /> Hesabımı Oluştur</>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                {authModal === 'login' ? (
                  <>Hesabınız yok mu? <button onClick={() => openModal('register')} className="text-blue-600 font-medium hover:underline">Ücretsiz Kayıt Olun</button></>
                ) : (
                  <>Zaten hesabınız var mı? <button onClick={() => openModal('login')} className="text-blue-600 font-medium hover:underline">Giriş Yapın</button></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
