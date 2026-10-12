import React, { useState } from 'react';
import { X, ExternalLink, ShoppingBag, Plus, Heart, ShieldCheck, Check, TrendingUp, Info, Store as StoreIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Condition } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedMiniatureId,
    setSelectedMiniatureId,
    miniatures,
    storeListings,
    addToCart,
    addToCollection,
    addToWishlist,
    formatPrice,
    setActiveSubdomain,
    setCurrentTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'specs' | 'history'>('listings');
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [acquisitionPrice, setAcquisitionPrice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition>('Caixa Acrílica Lacrada');
  const [collectionNotes, setCollectionNotes] = useState('');
  const [addedSuccessMsg, setAddedSuccessMsg] = useState<string | null>(null);

  if (!selectedMiniatureId) return null;

  const miniature = miniatures.find(m => m.id === selectedMiniatureId);
  if (!miniature) return null;

  // Find all active listings for this miniature
  const listings = storeListings.filter(l => l.miniatureId === miniature.id);

  const handleSaveToCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(acquisitionPrice) || miniature.avgPrice;
    addToCollection(miniature.id, selectedCondition, price, collectionNotes);
    setCollectionModalOpen(false);
    setAddedSuccessMsg('Miniatura adicionada com sucesso à sua Garagem!');
    setTimeout(() => setAddedSuccessMsg(null), 3000);
  };

  const handleAddToWishlist = () => {
    addToWishlist(miniature.id, miniature.lowestPrice, 'Alerta criado pelo Guia de Preços LigaHot');
    setAddedSuccessMsg('Alerta de Preço adicionado à sua Lista de Desejos!');
    setTimeout(() => setAddedSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 font-mono">
              {miniature.brand} · {miniature.scale}
            </span>
            <span className="text-neutral-500">/</span>
            <span className="text-xs text-neutral-300 font-medium truncate max-w-xs sm:max-w-md">
              {miniature.series}
            </span>
          </div>
          <button
            onClick={() => setSelectedMiniatureId(null)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {addedSuccessMsg && (
            <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between animate-fade-in">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                {addedSuccessMsg}
              </span>
              <button
                onClick={() => setAddedSuccessMsg(null)}
                className="text-emerald-400 hover:text-white text-xs"
              >
                Dispensar
              </button>
            </div>
          )}

          {/* Top Section: Media & LigaMagic Price Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Product Imagery */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative group">
                <img
                  src={miniature.imageUrl}
                  alt={miniature.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-neutral-950/85 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-amber-400 border border-neutral-800">
                  {miniature.rarity}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCollectionModalOpen(true)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Minha Garagem</span>
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span>Lista de Desejos</span>
                </button>
              </div>
            </div>

            {/* Right: Core Details & LigaMagic Price Summary */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {miniature.name}
                </h2>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {miniature.description}
                </p>
              </div>

              {/* Signature LigaMagic Price Matrix (Menor, Médio, Maior) */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800/80">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                    Cotação Oficial LigaHot
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {miniature.totalQuantityAvailable} un. disponíveis no marketplace
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="block text-[11px] text-neutral-400 uppercase font-medium">
                      Menor Preço
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                      {formatPrice(miniature.lowestPrice)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-amber-500/30 ring-1 ring-amber-500/20">
                    <span className="block text-[11px] text-amber-400/90 uppercase font-semibold">
                      Preço Médio
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-amber-300 tabular-nums">
                      {formatPrice(miniature.avgPrice)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="block text-[11px] text-neutral-400 uppercase font-medium">
                      Maior Preço
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-neutral-300 tabular-nums">
                      {formatPrice(miniature.highestPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                  <span>Atualizado com base em vendas verificadas</span>
                  <span>Avaliação: ★ {miniature.rating} ({miniature.viewsCount} visualizações)</span>
                </div>
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">Ano de Lançamento</span>
                  <span className="font-mono text-neutral-200 font-medium">{miniature.year}</span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">Tipo de Rodas</span>
                  <span className="text-neutral-200 font-medium truncate block" title={miniature.wheelsType}>
                    {miniature.wheelsType.split(' ')[0]} {miniature.wheelsType.split(' ')[1] || ''}
                  </span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">Peças Móveis</span>
                  <span className="text-neutral-200 font-medium">
                    {miniature.hasOpeningParts ? 'Sim (Capô/Portas)' : 'Não'}
                  </span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">Embalagem</span>
                  <span className="text-neutral-200 font-medium truncate block" title={miniature.packagingType}>
                    {miniature.packagingType.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section: Lojas Disponíveis, Histórico de Preços, Ficha Técnica */}
          <div className="border-t border-neutral-800 pt-4">
            <div className="flex border-b border-neutral-800 mb-4 gap-4">
              <button
                onClick={() => setActiveTab('listings')}
                className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative ${
                  activeTab === 'listings'
                    ? 'text-amber-400 border-b-2 border-amber-500'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Lojas com Estoque ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative ${
                  activeTab === 'history'
                    ? 'text-amber-400 border-b-2 border-amber-500'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Histórico de Vendas ({miniature.priceHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative ${
                  activeTab === 'specs'
                    ? 'text-amber-400 border-b-2 border-amber-500'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Ficha Técnica Completa
              </button>
            </div>

            {/* TAB 1: STORE LISTINGS (Iconic LigaMagic aggregated store comparator) */}
            {activeTab === 'listings' && (
              <div className="space-y-2.5">
                {listings.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-xs">
                    Nenhuma loja com estoque no momento. Seja o primeiro a anunciar no seu painel!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 font-semibold bg-neutral-950/50">
                          <th className="py-2.5 px-3">Loja / Vendedor</th>
                          <th className="py-2.5 px-3">Origem</th>
                          <th className="py-2.5 px-3">Condição & Detalhes</th>
                          <th className="py-2.5 px-3 text-right">Qtd</th>
                          <th className="py-2.5 px-3 text-right">Preço</th>
                          <th className="py-2.5 px-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {listings.map((item) => (
                          <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveSubdomain(item.storeSubdomain);
                                    setSelectedMiniatureId(null);
                                    setCurrentTab('stores');
                                  }}
                                  className="font-semibold text-white hover:text-amber-400 flex items-center gap-1 group text-left"
                                >
                                  <span>{item.storeName}</span>
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                                </button>
                                {item.isVerified && (
                                  <span title="Vendedor Verificado LigaHot" className="shrink-0 flex items-center">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                ★ {item.storeRating} · {item.storeSalesCount} vendas
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[11px] font-mono text-neutral-300">
                                {item.storeOriginState}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-medium text-neutral-200 block">
                                {item.condition}
                              </span>
                              <span className="text-[11px] text-neutral-400 line-clamp-1">
                                {item.notes}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right font-mono text-neutral-300">
                              {item.quantity} un.
                            </td>

                            <td className="py-3 px-3 text-right">
                              <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums block">
                                {formatPrice(item.price)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-[10px] text-neutral-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => addToCart(item, miniature)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1 transition-colors shadow-sm"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Comprar</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: HISTORICAL SALES (Price Guide Sales Data) */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-xs font-semibold text-neutral-300 block mb-2">
                    Evolução dos Últimos Preços Praticados na LigaHot
                  </span>

                  {/* Visual Trend Bars */}
                  <div className="h-32 flex items-end gap-3 pt-4 px-2 border-b border-neutral-800">
                    {miniature.priceHistory.map((item, idx) => {
                      const maxVal = Math.max(...miniature.priceHistory.map(p => p.price)) * 1.1;
                      const heightPercent = Math.round((item.price / maxVal) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatPrice(item.price)}
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t group-hover:brightness-110 transition-all"
                          />
                          <span className="text-[10px] font-mono text-neutral-500 mt-1">
                            {item.date.split('-').slice(1).join('/')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden">
                  {miniature.priceHistory.map((hist, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center justify-between text-xs bg-neutral-900/50">
                      <div>
                        <span className="text-neutral-300 font-medium">{hist.storeName}</span>
                        <span className="text-neutral-500 text-[11px] ml-2">({hist.condition})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-neutral-400 font-mono text-[11px]">{hist.date}</span>
                        <span className="font-mono font-bold text-amber-400 tabular-nums">
                          {formatPrice(hist.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: COMPLETE SPECS */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 block">Modelo / Casting</span>
                  <span className="font-semibold text-white">{miniature.casting}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 block">Pintura & Acabamento</span>
                  <span className="font-semibold text-white">{miniature.color}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 block">Rodas & Pneus</span>
                  <span className="font-semibold text-white">{miniature.wheelsType}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 block">Aberturas & Detalhamento</span>
                  <span className="font-semibold text-white">
                    {miniature.openingPartsDetail || 'Sem partes móveis'}
                  </span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 block">Tipo de Embalagem</span>
                  <span className="font-semibold text-white">{miniature.packagingType}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 block">Classificação de Raridade</span>
                  <span className="font-semibold text-amber-400">{miniature.rarity}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Deseja vender este item? Adicione ao seu catálogo pelo <strong className="text-amber-400">Painel do Lojista</strong>.
          </span>
          <button
            onClick={() => setSelectedMiniatureId(null)}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>

      {/* Nested Modal: Add to Virtual Garage */}
      {collectionModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-500" />
                Registrar na Minha Garagem Virtual
              </h3>
              <button
                onClick={() => setCollectionModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveToCollection} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Miniatura</label>
                <p className="font-semibold text-white bg-neutral-950 p-2 rounded border border-neutral-800">
                  {miniature.name}
                </p>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Estado / Condição</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value as Condition)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-2 rounded focus:outline-none focus:border-amber-500"
                >
                  <option value="Caixa Acrílica Lacrada">Caixa Acrílica Lacrada</option>
                  <option value="Lacrado / Blister Perfeito">Lacrado / Blister Perfeito</option>
                  <option value="Blister C-8 (Leve detalhe no cartão)">Blister C-8 (Leve detalhe no cartão)</option>
                  <option value="Loose / Solto Perfeito">Loose / Solto Perfeito</option>
                  <option value="Loose com Detalhe">Loose com Detalhe</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Preço Pago (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={`Sugerido: ${miniature.avgPrice}`}
                  value={acquisitionPrice}
                  onChange={(e) => setAcquisitionPrice(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-2 rounded focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Usado para calcular a valorização ou rentabilidade do seu acervo.
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Anotações Pessoais</label>
                <textarea
                  placeholder="Ex: Comprado no encontro de colecionadores de Curitiba, com protetor de acrílico..."
                  value={collectionNotes}
                  onChange={(e) => setCollectionNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-2 rounded focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCollectionModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
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
