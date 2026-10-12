import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Flame, Sparkles, X, ChevronRight, BookmarkCheck, Store as StoreIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    miniatures,
    setSelectedMiniatureId,
    cart,
    setIsCartOpen,
    currency,
    setCurrency,
    formatPrice,
    setActiveSubdomain,
    userCollection
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter miniatures for autocomplete
  const filteredSuggestions = searchQuery.trim().length > 1
    ? miniatures.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.casting.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.series.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setActiveSubdomain(null);
            setCurrentTab('marketplace');
            setSearchQuery('');
          }}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-neutral-950 shadow-md shadow-orange-950/50 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-neutral-950 stroke-neutral-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
              LIGA<span className="text-amber-500">HOT</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">1:64</span>
            </span>
          </div>
        </button>

        {/* Center: Search with Smart Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar Hot Wheels, Tomica, Kaido House, RLC..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder:text-neutral-500 text-xs sm:text-sm rounded-lg pl-9.5 pr-8 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Miniaturas no Catálogo Master
              </div>
              {filteredSuggestions.map((min) => (
                <button
                  key={min.id}
                  onClick={() => {
                    setSelectedMiniatureId(min.id);
                    setIsSearchFocused(false);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-neutral-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={min.imageUrl}
                      alt={min.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-7 object-cover rounded bg-neutral-800 shrink-0 border border-neutral-700/50"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-200 group-hover:text-amber-400 truncate">
                        {min.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {min.brand} · {min.series}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-mono font-medium text-amber-400">
                      a partir de {formatPrice(min.lowestPrice)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (single line, no wrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <button
            onClick={() => {
              setActiveSubdomain(null);
              setCurrentTab('marketplace');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              currentTab === 'marketplace' ? 'text-amber-400 underline decoration-amber-500 decoration-2 underline-offset-8' : ''
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => {
              setActiveSubdomain(null);
              setCurrentTab('price-guide');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              currentTab === 'price-guide' ? 'text-amber-400 underline decoration-amber-500 decoration-2 underline-offset-8' : ''
            }`}
          >
            Guia de Preços
          </button>
          <button
            onClick={() => {
              setActiveSubdomain(null);
              setCurrentTab('collection');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 flex items-center gap-1.5 ${
              currentTab === 'collection' ? 'text-amber-400 underline decoration-amber-500 decoration-2 underline-offset-8' : ''
            }`}
          >
            <span>Minha Garagem</span>
            {userCollection.length > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-neutral-800 text-amber-400">
                {userCollection.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSubdomain(null);
              setCurrentTab('community');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              currentTab === 'community' ? 'text-amber-400 underline decoration-amber-500 decoration-2 underline-offset-8' : ''
            }`}
          >
            Lounge de Trocas
          </button>
          <button
            onClick={() => {
              setActiveSubdomain(null);
              setCurrentTab('stores');
            }}
            className={`whitespace-nowrap transition-colors hover:text-amber-400 ${
              currentTab === 'stores' ? 'text-amber-400 underline decoration-amber-500 decoration-2 underline-offset-8' : ''
            }`}
          >
            Lojas
          </button>
        </nav>

        {/* Zone 3: Actions (Currency, Cart, Merchant CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'BRL' ? 'USD' : 'BRL')}
            className="hidden sm:inline-flex text-[11px] font-mono font-medium px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            title="Alternar moeda de exibição"
          >
            {currency === 'BRL' ? '🇧🇷 R$ BRL' : '🇺🇸 $ USD'}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
            aria-label="Ver Carrinho de Compras"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Store Management / Dashboard CTA */}
          <button
            onClick={() => {
              setCurrentTab('my-store-dashboard');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              currentTab === 'my-store-dashboard'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
          >
            <StoreIcon className="w-3.5 h-3.5" />
            <span>Painel da Loja</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-neutral-800 gap-4 text-xs font-medium text-neutral-400 scrollbar-none">
        <button
          onClick={() => { setActiveSubdomain(null); setCurrentTab('marketplace'); }}
          className={`whitespace-nowrap ${currentTab === 'marketplace' ? 'text-amber-400 font-bold' : ''}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => { setActiveSubdomain(null); setCurrentTab('price-guide'); }}
          className={`whitespace-nowrap ${currentTab === 'price-guide' ? 'text-amber-400 font-bold' : ''}`}
        >
          Guia de Preços
        </button>
        <button
          onClick={() => { setActiveSubdomain(null); setCurrentTab('collection'); }}
          className={`whitespace-nowrap ${currentTab === 'collection' ? 'text-amber-400 font-bold' : ''}`}
        >
          Minha Garagem ({userCollection.length})
        </button>
        <button
          onClick={() => { setActiveSubdomain(null); setCurrentTab('community'); }}
          className={`whitespace-nowrap ${currentTab === 'community' ? 'text-amber-400 font-bold' : ''}`}
        >
          Lounge de Trocas
        </button>
        <button
          onClick={() => { setActiveSubdomain(null); setCurrentTab('stores'); }}
          className={`whitespace-nowrap ${currentTab === 'stores' ? 'text-amber-400 font-bold' : ''}`}
        >
          Lojas
        </button>
      </div>
    </header>
  );
};
