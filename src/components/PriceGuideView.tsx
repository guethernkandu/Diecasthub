import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Flame,
  Info,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Brand, RarityTier } from '../types';

export const PriceGuideView: React.FC = () => {
  const {
    miniatures,
    storeListings,
    setSelectedMiniatureId,
    formatPrice
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todos');
  const [selectedRarity, setSelectedRarity] = useState<string>('Todos');
  const [sortField, setSortField] = useState<'avgPrice' | 'viewsCount' | 'salesCount' | 'year'>('avgPrice');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = miniatures.filter((item) => {
    const matchesSearch = !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.casting.toLowerCase().includes(search.toLowerCase()) ||
      item.series.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === 'Todos' || item.brand === selectedBrand;
    const matchesRarity = selectedRarity === 'Todos' || item.rarity === selectedRarity;
    return matchesSearch && matchesBrand && matchesRarity;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Guia de Preços & Cotações Diecast (LigaHot)
          </h1>
        </div>
        <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
          O índice de referência de valores para miniaturas 1:64 no Brasil. Nossos algoritmos agregam vendas verificadas e anúncios em tempo real para calcular com precisão a cotação <strong>Menor</strong>, <strong>Média</strong> e <strong>Maior</strong> de cada modelo.
        </p>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-800">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por carro, casting ou série..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="Todos">Todas as Marcas</option>
              <option value="Hot Wheels">Hot Wheels</option>
              <option value="Tomica">Tomica</option>
              <option value="Kaido House">Kaido House</option>
              <option value="Mini GT">Mini GT</option>
              <option value="Inno64">Inno64</option>
              <option value="Tarmac Works">Tarmac Works</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="Todos">Todas as Classificações</option>
              <option value="Red Line Club (RLC)">Red Line Club (RLC)</option>
              <option value="Super Treasure Hunt (STH)">Super Treasure Hunt (STH)</option>
              <option value="Kaido House Exclusive">Kaido House Exclusive</option>
              <option value="Tomica Limited Vintage">Tomica Limited Vintage</option>
              <option value="Premium / Car Culture">Premium / Car Culture</option>
              <option value="Chase / Edição Secreta">Chase / Edição Secreta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950 font-semibold">
                <th className="py-3.5 px-4">Miniatura & Linha</th>
                <th className="py-3.5 px-4">Fabricante</th>
                <th className="py-3.5 px-4">Raridade</th>
                <th className="py-3.5 px-4 text-center">Menor Preço</th>
                <th className="py-3.5 px-4 text-center">Preço Médio</th>
                <th className="py-3.5 px-4 text-center">Maior Preço</th>
                <th className="py-3.5 px-4 text-center">Lojas c/ Estoque</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filtered.map((item) => {
                const availableListings = storeListings.filter(l => l.miniatureId === item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedMiniatureId(item.id)}
                    className="hover:bg-neutral-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
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
                            {item.casting} · {item.year}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-300">
                      {item.brand}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-amber-400 font-mono">
                        {item.rarity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                        {formatPrice(item.lowestPrice)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-amber-300 tabular-nums">
                        {formatPrice(item.avgPrice)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {formatPrice(item.highestPrice)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-neutral-300">
                        {availableListings.length} disponíveis
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMiniatureId(item.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-200 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Cotação</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
