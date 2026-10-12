import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  Award,
  Store as StoreIcon,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Brand } from '../types';
import { HERO_IMAGE } from '../data/mockData';

export const MarketplaceHome: React.FC = () => {
  const {
    miniatures,
    stores,
    storeListings,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    setSelectedMiniatureId,
    setActiveSubdomain,
    setCurrentTab,
    formatPrice,
    addToCart
  } = useApp();

  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'searched' | 'sold' | 'rated'>('searched');
  const [selectedSort, setSelectedSort] = useState<'relevance' | 'lowestPrice' | 'highestPrice' | 'newest'>('relevance');

  const BRANDS: Array<Brand | 'Todos'> = [
    'Todos',
    'Hot Wheels',
    'Tomica',
    'Kaido House',
    'Mini GT',
    'Inno64',
    'Tarmac Works'
  ];

  // Most searched items
  const mostSearched = [...miniatures].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 5);

  // Most sold items
  const mostSold = [...miniatures].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  // Top rated items
  const topRatedItems = [...miniatures].sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Top rated stores
  const topRatedStores = [...stores].sort((a, b) => b.rating - a.rating);

  // Filtered miniatures catalog
  const filteredMiniatures = miniatures.filter((item) => {
    const matchesBrand = selectedBrand === 'Todos' || item.brand === selectedBrand;
    const matchesSearch = searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.casting.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.series.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (selectedSort === 'lowestPrice') return a.lowestPrice - b.lowestPrice;
    if (selectedSort === 'highestPrice') return b.lowestPrice - a.lowestPrice;
    if (selectedSort === 'newest') return b.year - a.year;
    return b.viewsCount - a.viewsCount;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO CAMPAIGN SHOWCASE */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
          {/* Left Text / Search & Value Prop */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10 bg-gradient-to-r from-neutral-950 via-neutral-950/95 to-transparent">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  O Portal Oficial da Comunidade Diecast Brasil
                </span>
                <span className="text-neutral-500 text-xs hidden sm:inline">1:64 Collector Hub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
                O Maior Guia de Preços & Marketplace de <span className="text-amber-500">Miniaturas</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
                Consulte cotações em tempo real de Hot Wheels RLC, Super Treasure Hunts, Tomica Limited Vintage e Kaido House. Compre direto das melhores lojas ou crie sua própria loja no ecossistema LigaHot.
              </p>
            </div>

            {/* Quick Hero Stats Strip */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-800/80 mt-6">
              <div>
                <span className="block text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
                  +1.400
                </span>
                <span className="text-[11px] text-neutral-400">Miniaturas Catalogadas</span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  100%
                </span>
                <span className="text-[11px] text-neutral-400">Cotação com Vendas Reais</span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  R$ 0
                </span>
                <span className="text-[11px] text-neutral-400">Para Abrir Sua Loja</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt="Coleção de miniaturas diecast premium"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* 2. TABELA LIGAMAGIC: MAIS BUSCADAS, MAIS VENDIDAS & TOP AVALIADOS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Barômetro do Mercado LigaHot
            </h2>
            <p className="text-xs text-neutral-400">
              Cotações consolidadas com base nas lojas ativas da plataforma
            </p>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActiveLeaderboardTab('searched')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeLeaderboardTab === 'searched'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mais Buscadas
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('sold')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeLeaderboardTab === 'sold'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mais Vendidas
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('rated')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeLeaderboardTab === 'rated'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Top Avaliados
            </button>
          </div>
        </div>

        {/* Dynamic Leaderboard Table (LigaMagic Layout) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950 font-semibold">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Miniatura / Linha</th>
                  <th className="py-3 px-4">Marca & Ano</th>
                  <th className="py-3 px-4 text-center">Menor Preço</th>
                  <th className="py-3 px-4 text-center">Preço Médio</th>
                  <th className="py-3 px-4 text-center">Maior Preço</th>
                  <th className="py-3 px-4 text-right">Lojas com Estoque</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {(activeLeaderboardTab === 'searched'
                  ? mostSearched
                  : activeLeaderboardTab === 'sold'
                  ? mostSold
                  : topRatedItems
                ).map((item, index) => {
                  const matchingListings = storeListings.filter(l => l.miniatureId === item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedMiniatureId(item.id)}
                      className="hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-neutral-500 group-hover:text-amber-400">
                        0{index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-9 object-cover rounded bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-white group-hover:text-amber-400 transition-colors block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {item.series}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-neutral-300 block">{item.brand}</span>
                        <span className="font-mono text-[11px] text-neutral-500">{item.year} · {item.scale}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                          {formatPrice(item.lowestPrice)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-amber-300 tabular-nums">
                          {formatPrice(item.avgPrice)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-neutral-400 tabular-nums">
                          {formatPrice(item.highestPrice)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-mono text-neutral-300">
                          {matchingListings.length} {matchingListings.length === 1 ? 'loja' : 'lojas'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMiniatureId(item.id);
                          }}
                          className="px-2.5 py-1 rounded bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-300 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Ver Cotação</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. LOJAS MAIS BEM AVALIADAS (TOP-RATED STORES DIRECTORY) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Lojas Mais Bem Avaliadas da LigaHot
            </h2>
            <p className="text-xs text-neutral-400">
              Lojistas verificados com estoques integrados ao banco de dados master
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('stores')}
            className="text-xs font-medium text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Todas as Lojas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topRatedStores.slice(0, 4).map((store) => (
            <div
              key={store.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={store.avatarUrl}
                    alt={store.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-400 truncate flex items-center gap-1">
                      {store.name}
                      {store.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </h3>
                    <p className="text-[11px] font-mono text-amber-500 truncate">
                      {store.subdomain}.ligahot.com.br
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {store.bio}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-300 pt-2 border-t border-neutral-800/80">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    ★ {store.rating} ({store.reviewsCount})
                  </span>
                  <span className="font-mono text-neutral-400">
                    {store.totalSales} vendas
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSubdomain(store.subdomain);
                  setCurrentTab('stores');
                }}
                className="mt-4 w-full py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Acessar Loja</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COLEÇÕES EM DESTAQUE (FEATURED COLLECTIONS) */}
      <section className="space-y-4">
        <div className="border-b border-neutral-800 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            Coleções em Destaque
          </h2>
          <p className="text-xs text-neutral-400">
            Linhas premium mais negociadas e valorizadas pelos colecionadores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => {
              setSelectedBrand('Hot Wheels');
              setSearchQuery('RLC');
            }}
            className="p-5 rounded-xl bg-gradient-to-br from-blue-950/60 to-neutral-900 border border-blue-900/40 hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              Mattel Creations
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 mt-1">
              Red Line Club (RLC)
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Modelos com pintura Spectraflame, bases acrílicas numeradas e pneus Real Riders com detalhes em fibra de carbono.
            </p>
            <span className="text-xs text-blue-400 font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explorar Coleção RLC &rarr;
            </span>
          </div>

          <div
            onClick={() => {
              setSelectedBrand('Kaido House');
              setSearchQuery('');
            }}
            className="p-5 rounded-xl bg-gradient-to-br from-purple-950/60 to-neutral-900 border border-purple-900/40 hover:border-purple-500/50 cursor-pointer transition-all group"
          >
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
              Jun Imai Design
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 mt-1">
              Kaido House Pro Street
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Miniaturas pesadas em metal fundido, motores detalhados bi-turbo expostos sob capôs basculantes e caixas colecionáveis.
            </p>
            <span className="text-xs text-purple-400 font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explorar Kaido House &rarr;
            </span>
          </div>

          <div
            onClick={() => {
              setSelectedBrand('Tomica');
              setSearchQuery('');
            }}
            className="p-5 rounded-xl bg-gradient-to-br from-red-950/60 to-neutral-900 border border-red-900/40 hover:border-red-500/50 cursor-pointer transition-all group"
          >
            <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">
              Tomytec Japan
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-red-300 mt-1">
              Tomica Limited Vintage Neo
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              A reprodução mais fiel e rigorosa do mundo na escala 1:64 sem distorções, com acabamento e caixas originais japonesas.
            </p>
            <span className="text-xs text-red-400 font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explorar Tomica TLV &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* 5. MASTER CATALOGUE GRID (WITH BRAND TABS & SORTING) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Catálogo Geral & Cotações Ativas
            </h2>
            <p className="text-xs text-neutral-400">
              Mostrando {filteredMiniatures.length} modelos disponíveis para compra imediata
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter Tabs */}
            <div className="flex items-center overflow-x-auto p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium max-w-full">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                    selectedBrand === brand
                      ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="relevance">Mais Vistos & Populares</option>
              <option value="lowestPrice">Menor Preço Inicial</option>
              <option value="highestPrice">Maior Preço Inicial</option>
              <option value="newest">Ano de Lançamento</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMiniatures.map((item) => {
            const listings = storeListings.filter(l => l.miniatureId === item.id);
            const lowestListing = listings.length > 0
              ? [...listings].sort((a, b) => a.price - b.price)[0]
              : null;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedMiniatureId(item.id)}
                className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200 group hover:-translate-y-0.5 shadow-md"
              >
                {/* Image Container */}
                <div>
                  <div className="aspect-[4/3] bg-neutral-950 relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-neutral-800">
                      {item.brand}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 border border-neutral-800">
                      {listings.length} {listings.length === 1 ? 'loja' : 'lojas'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <span>{item.scale}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{item.series}</span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Price Snapshot */}
                    <div className="pt-2 flex items-baseline justify-between border-t border-neutral-800/80">
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-medium">
                          Menor Preço
                        </span>
                        <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                          {formatPrice(item.lowestPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block uppercase font-medium">
                          Preço Médio
                        </span>
                        <span className="text-xs font-mono text-neutral-300 tabular-nums">
                          {formatPrice(item.avgPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-400 truncate">
                    {lowestListing ? `Em: ${lowestListing.storeName}` : 'Ver Lojas'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (lowestListing) {
                        addToCart(lowestListing, item);
                      } else {
                        setSelectedMiniatureId(item.id);
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Comprar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
