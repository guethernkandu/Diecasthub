import React, { useState } from 'react';
import {
  Store as StoreIcon,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Plus,
  Package,
  Sparkles,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoresDirectory: React.FC = () => {
  const {
    stores,
    storeListings,
    setActiveSubdomain,
    userStore,
    setCurrentTab
  } = useApp();

  const [search, setSearch] = useState('');

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.subdomain.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <StoreIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Diretório de Lojas & Lojistas Parceiros
            </h1>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Todas as lojas operam sob seus próprios subdomínios exclusivos (ex: <code>garagem-diecast.ligahot.com.br</code>) com estoques integrados à nossa base unificada de cotação e compras.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('my-store-dashboard')}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar ou Gerenciar Minha Loja</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome da loja, cidade ou subdomínio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-amber-500"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          {filteredStores.length} lojas credenciadas
        </span>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => {
          const storeStockCount = storeListings.filter(l => l.storeId === store.id).length;
          const isUserStore = store.id === userStore.id;

          return (
            <div
              key={store.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-md"
            >
              {/* Header with Theme Color Accent */}
              <div>
                <div
                  style={{
                    background: `linear-gradient(135deg, ${store.theme.primaryColor} 0%, #171717 100%)`
                  }}
                  className="h-24 p-4 relative flex items-start justify-between border-b border-neutral-800"
                >
                  <span
                    style={{ borderColor: store.theme.accentColor, color: store.theme.accentColor }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-neutral-950/70"
                  >
                    {store.subdomain}.ligahot.com.br
                  </span>
                  {isUserStore && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950">
                      Sua Loja
                    </span>
                  )}
                </div>

                <div className="p-5 pt-0 relative space-y-3">
                  <div className="-mt-8 flex items-end justify-between">
                    <img
                      src={store.avatarUrl}
                      alt={store.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-neutral-800 bg-neutral-950 shadow-lg"
                    />
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400">
                        ★ {store.rating}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        ({store.reviewsCount} avaliações)
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      <span>{store.name}</span>
                      {store.isVerified && <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />}
                    </h3>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {store.location} · {store.totalSales} vendas
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {store.bio}
                  </p>

                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs flex items-center justify-between text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-neutral-500" />
                      Estoque Ativo:
                    </span>
                    <span className="font-mono font-bold text-white">
                      {storeStockCount} miniaturas
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveSubdomain(store.subdomain);
                  }}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Entrar na Loja</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {isUserStore && (
                  <button
                    onClick={() => setCurrentTab('my-store-dashboard')}
                    className="py-2 px-3 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                  >
                    Gerenciar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
