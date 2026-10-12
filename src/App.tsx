import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SubdomainBar } from './components/SubdomainBar';
import { Header } from './components/Header';
import { MarketplaceHome } from './components/MarketplaceHome';
import { PriceGuideView } from './components/PriceGuideView';
import { CollectionTracker } from './components/CollectionTracker';
import { TradeLounge } from './components/TradeLounge';
import { StoresDirectory } from './components/StoresDirectory';
import { StoreFrontView } from './components/StoreFrontView';
import { MerchantDashboard } from './components/MerchantDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Flame, ShieldCheck, Heart, Award } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeSubdomain, currentTab, setCurrentTab, setActiveSubdomain } = useApp();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* 1. Simulated Web Subdomain Address Bar */}
      <SubdomainBar />

      {/* 2. Top Navigation Bar */}
      <Header />

      {/* 3. Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* If user is visiting an individual store subdomain */}
        {activeSubdomain && currentTab !== 'my-store-dashboard' ? (
          <StoreFrontView storeSubdomain={activeSubdomain} />
        ) : (
          <>
            {currentTab === 'marketplace' && <MarketplaceHome />}
            {currentTab === 'price-guide' && <PriceGuideView />}
            {currentTab === 'collection' && <CollectionTracker />}
            {currentTab === 'community' && <TradeLounge />}
            {currentTab === 'stores' && <StoresDirectory />}
            {currentTab === 'my-store-dashboard' && <MerchantDashboard />}
          </>
        )}
      </main>

      {/* 4. Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />

      {/* 5. Clean Editorial Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950/90 mt-16 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-neutral-950 font-bold">
                  <Flame className="w-4 h-4 fill-neutral-950 stroke-neutral-950" />
                </div>
                <span className="font-extrabold text-white text-base">
                  LIGA<span className="text-amber-500">HOT</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                A principal plataforma e guia de preços de miniaturas colecionáveis no Brasil. Cotações reais para Hot Wheels, Tomica, Kaido House e Mini GT.
              </p>
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Intermediação segura e proteção ao colecionador</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Marketplace</h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <button onClick={() => { setActiveSubdomain(null); setCurrentTab('marketplace'); }} className="hover:text-amber-400">
                    Catálogo de Miniaturas
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveSubdomain(null); setCurrentTab('price-guide'); }} className="hover:text-amber-400">
                    Guia de Preços & Cotações
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveSubdomain(null); setCurrentTab('stores'); }} className="hover:text-amber-400">
                    Lojas Parceiras Credenciadas
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveSubdomain(null); setCurrentTab('community'); }} className="hover:text-amber-400">
                    Lounge de Trocas (WTT)
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Lojistas & Vendedores</h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <button onClick={() => setCurrentTab('my-store-dashboard')} className="hover:text-amber-400">
                    Criar Minha Loja (exemplo.ligahot.com.br)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('my-store-dashboard')} className="hover:text-amber-400">
                    Painel de Gestão & Estoque
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('my-store-dashboard')} className="hover:text-amber-400">
                    Rastreamento de Pedidos
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('my-store-dashboard')} className="hover:text-amber-400">
                    Customização de Temas
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Colecionadores</h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <button onClick={() => { setActiveSubdomain(null); setCurrentTab('collection'); }} className="hover:text-amber-400">
                    Minha Garagem Virtual
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveSubdomain(null); setCurrentTab('collection'); }} className="hover:text-amber-400">
                    Lista de Desejos & Alertas
                  </button>
                </li>
                <li>
                  <span className="text-neutral-500">Avaliação Média: ★ 4.98 / 5.0</span>
                </li>
                <li>
                  <span className="text-neutral-500 font-mono text-[11px]">v2.4.0 · Brasil</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <span>© 2026 LigaHot Diecast Brasil. Todos os direitos reservados. Inspirado na excelência do modelo LigaMagic.</span>
            <div className="flex items-center gap-4">
              <span>Termos de Uso</span>
              <span>·</span>
              <span>Políticas de Privacidade</span>
              <span>·</span>
              <span>Segurança de Dados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
