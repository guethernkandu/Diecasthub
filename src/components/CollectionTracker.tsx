import React, { useState } from 'react';
import {
  Car,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Repeat,
  Heart,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Download,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Condition, Brand } from '../types';

export const CollectionTracker: React.FC = () => {
  const {
    userCollection,
    removeFromCollection,
    toggleForTrade,
    userWishlist,
    removeFromWishlist,
    addToWishlist,
    miniatures,
    addToCollection,
    formatPrice,
    setSelectedMiniatureId,
    setCurrentTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'collection' | 'wishlist'>('collection');
  const [filterBrand, setFilterBrand] = useState<string>('Todos');
  const [onlyForTrade, setOnlyForTrade] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item modal form state
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [selectedMinId, setSelectedMinId] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition>('Caixa Acrílica Lacrada');
  const [paidPrice, setPaidPrice] = useState('');
  const [userNotes, setUserNotes] = useState('');

  // Financial calculations
  const totalItemsCount = userCollection.length;
  const totalAcquisitionCost = userCollection.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalMarketValue = userCollection.reduce((sum, item) => {
    // Look up latest average price from master database
    const min = miniatures.find(m => m.id === item.miniatureId);
    return sum + (min ? min.avgPrice : item.currentMarketPrice);
  }, 0);

  const valueDelta = totalMarketValue - totalAcquisitionCost;
  const percentageGain = totalAcquisitionCost > 0
    ? ((valueDelta / totalAcquisitionCost) * 100).toFixed(1)
    : '0.0';

  const itemsForTradeCount = userCollection.filter(i => i.isForTrade).length;

  const filteredCollection = userCollection.filter(item => {
    const min = miniatures.find(m => m.id === item.miniatureId) || item.miniature;
    const matchesBrand = filterBrand === 'Todos' || min.brand === filterBrand;
    const matchesTrade = !onlyForTrade || item.isForTrade;
    return matchesBrand && matchesTrade;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinId) return;
    const min = miniatures.find(m => m.id === selectedMinId);
    const price = parseFloat(paidPrice) || (min ? min.avgPrice : 0);
    addToCollection(selectedMinId, selectedCondition, price, userNotes);
    setIsAddModalOpen(false);
    setSelectedMinId('');
    setPaidPrice('');
    setUserNotes('');
    setSearchCatalogQuery('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. PORTFOLIO FINANCIAL OVERVIEW STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Total na Garagem</span>
            <Car className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            {totalItemsCount} <span className="text-xs font-normal text-neutral-500 font-sans">modelos</span>
          </div>
          <span className="text-[11px] text-neutral-400 block">
            {itemsForTradeCount} disponíveis para proposta de troca
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Valor de Mercado Atual</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {formatPrice(totalMarketValue)}
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Baseado no Preço Médio oficial da LigaHot
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Custo de Aquisição</span>
            <DollarSign className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-300 tabular-nums">
            {formatPrice(totalAcquisitionCost)}
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Total investido nas peças cadastradas
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Valorização do Acervo</span>
            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${valueDelta >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
              {valueDelta >= 0 ? `+${percentageGain}%` : `${percentageGain}%`}
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${valueDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {valueDelta >= 0 ? `+${formatPrice(valueDelta)}` : formatPrice(valueDelta)}
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Ganho patrimonial estimado da sua coleção
          </span>
        </div>
      </div>

      {/* 2. CONTROLS & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('collection')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'collection'
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Minha Garagem ({userCollection.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'wishlist'
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Lista de Desejos / Alertas ({userWishlist.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'collection' && (
            <>
              {/* Filter Trade Only */}
              <button
                onClick={() => setOnlyForTrade(!onlyForTrade)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  onlyForTrade
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Apenas para Troca ({itemsForTradeCount})</span>
              </button>

              {/* Brand Filter */}
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                <option value="Todos">Todas as Marcas</option>
                <option value="Hot Wheels">Hot Wheels</option>
                <option value="Tomica">Tomica</option>
                <option value="Kaido House">Kaido House</option>
                <option value="Mini GT">Mini GT</option>
                <option value="Inno64">Inno64</option>
              </select>
            </>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Miniatura</span>
          </button>
        </div>
      </div>

      {/* 3. TAB: COLLECTION ITEMS */}
      {activeTab === 'collection' && (
        <div className="space-y-4">
          {filteredCollection.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
              <Car className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">Sua garagem está vazia com esses filtros</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Adicione miniaturas do catálogo para acompanhar a valorização e gerenciar propostas de troca.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Primeira Peça
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950 font-semibold">
                    <th className="py-3 px-4">Miniatura</th>
                    <th className="py-3 px-4">Estado / Condição</th>
                    <th className="py-3 px-4">Data Aquisição</th>
                    <th className="py-3 px-4 text-right">Preço Pago</th>
                    <th className="py-3 px-4 text-right">Preço Atual da Liga</th>
                    <th className="py-3 px-4 text-center">Lucro / Valorização</th>
                    <th className="py-3 px-4 text-center">Para Troca?</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {filteredCollection.map((item) => {
                    const min = miniatures.find(m => m.id === item.miniatureId) || item.miniature;
                    const gain = min.avgPrice - item.purchasePrice;
                    const gainPercent = item.purchasePrice > 0
                      ? ((gain / item.purchasePrice) * 100).toFixed(0)
                      : '0';

                    return (
                      <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={min.imageUrl}
                              alt={min.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-9 object-cover rounded bg-neutral-950 border border-neutral-800 shrink-0"
                            />
                            <div>
                              <button
                                onClick={() => setSelectedMiniatureId(min.id)}
                                className="font-semibold text-white hover:text-amber-400 transition-colors text-left block"
                              >
                                {min.name}
                              </button>
                              <span className="text-[11px] text-neutral-400">
                                {min.brand} · {min.scale} · {min.series}
                              </span>
                              {item.userNotes && (
                                <span className="text-[10px] text-neutral-500 block italic mt-0.5">
                                  "{item.userNotes}"
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-200 font-medium">
                            {item.condition}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-neutral-400 text-[11px]">
                          {item.acquiredDate}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-medium text-neutral-300">
                          {formatPrice(item.purchasePrice)}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-300 tabular-nums">
                          {formatPrice(min.avgPrice)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`font-mono text-xs font-bold ${gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {gain >= 0 ? `+${gainPercent}%` : `${gainPercent}%`}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleForTrade(item.id)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                              item.isForTrade
                                ? 'bg-amber-500 text-neutral-950'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {item.isForTrade ? 'Sim (WTT)' : 'Não'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => removeFromCollection(item.id)}
                            className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                            title="Remover da coleção"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: WISHLIST / WANT LIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-400">
            Acompanhe miniaturas que você deseja comprar. Quando uma loja anunciar por valor igual ou inferior ao seu preço alvo, o alerta será disparado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userWishlist.map((wish) => {
              const min = miniatures.find(m => m.id === wish.miniatureId) || wish.miniature;
              const hasDeal = min.lowestPrice <= wish.targetPrice;

              return (
                <div
                  key={wish.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={min.imageUrl}
                      alt={min.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 object-cover rounded bg-neutral-950 border border-neutral-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4
                        onClick={() => setSelectedMiniatureId(min.id)}
                        className="text-xs font-bold text-white hover:text-amber-400 cursor-pointer truncate"
                      >
                        {min.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">{min.brand} · {min.series}</p>
                      {wish.notes && (
                        <p className="text-[10px] text-neutral-500 italic mt-0.5 line-clamp-1">
                          {wish.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Preço Alvo</span>
                      <span className="font-mono font-bold text-amber-400">
                        {formatPrice(wish.targetPrice)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block">Menor no Mercado</span>
                      <span className={`font-mono font-bold ${hasDeal ? 'text-emerald-400' : 'text-neutral-300'}`}>
                        {formatPrice(min.lowestPrice)}
                      </span>
                    </div>
                  </div>

                  {hasDeal && (
                    <div className="p-2 rounded bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Alvo Atingido! Oferta disponível no marketplace.</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedMiniatureId(min.id)}
                      className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                    >
                      Ver Ofertas
                    </button>
                    <button
                      onClick={() => removeFromWishlist(wish.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 bg-neutral-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD MINIATURE TO COLLECTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              Adicionar Miniatura ao Seu Acervo
            </h3>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Selecione o Modelo do Catálogo Master LigaHot
                </label>
                <select
                  required
                  value={selectedMinId}
                  onChange={(e) => {
                    setSelectedMinId(e.target.value);
                    const found = miniatures.find(m => m.id === e.target.value);
                    if (found) setPaidPrice(found.avgPrice.toString());
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Escolha uma miniatura...</option>
                  {miniatures.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.brand} - {m.year}) - Média: R$ {m.avgPrice}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Condição da Peça
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value as Condition)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    <option value="Caixa Acrílica Lacrada">Caixa Acrílica Lacrada</option>
                    <option value="Lacrado / Blister Perfeito">Lacrado / Blister Perfeito</option>
                    <option value="Blister C-8 (Leve detalhe no cartão)">Blister C-8 (Leve detalhe)</option>
                    <option value="Loose / Solto Perfeito">Loose / Solto Perfeito</option>
                    <option value="Loose com Detalhe">Loose com Detalhe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Preço Pago (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 250.00"
                    value={paidPrice}
                    onChange={(e) => setPaidPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Anotações da Garagem (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Comprei no encontro de diecast, número de série #124, sem riscos na bolha."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Salvar na Garagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
