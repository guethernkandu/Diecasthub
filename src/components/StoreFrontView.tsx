import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Send,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Info,
  Package,
  MessageSquare,
  ArrowLeft,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Store } from '../types';

interface StoreFrontViewProps {
  storeSubdomain: string;
}

export const StoreFrontView: React.FC<StoreFrontViewProps> = ({ storeSubdomain }) => {
  const {
    stores,
    storeListings,
    miniatures,
    addToCart,
    setSelectedMiniatureId,
    setActiveSubdomain,
    setCurrentTab,
    formatPrice,
    userStore,
    replyToInquiry
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'policies' | 'contact'>('catalog');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryItem, setInquiryItem] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Find store by subdomain
  const store = stores.find(s => s.subdomain === storeSubdomain) || stores[0];

  // Find listings belonging exclusively to this store
  const storeItems = storeListings.filter(l => l.storeId === store.id);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMsg.trim()) return;
    setSentSuccess(true);
    setInquiryMsg('');
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Return to Platform Bar */}
      <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-xs">
        <button
          onClick={() => {
            setActiveSubdomain(null);
            setCurrentTab('marketplace');
          }}
          className="flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para o Portal Geral LigaHot</span>
        </button>

        <span className="font-mono text-neutral-400">
          Loja Oficial Integrada: <strong className="text-white">{store.subdomain}.ligahot.com.br</strong>
        </span>

        {store.id === userStore.id && (
          <button
            onClick={() => setCurrentTab('my-store-dashboard')}
            className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 text-xs transition-colors"
          >
            Editar Esta Loja no Painel
          </button>
        )}
      </div>

      {/* Store Header / Custom Branded Banner */}
      <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
        {/* Banner with custom theme styling */}
        <div
          style={{
            background: `linear-gradient(135deg, ${store.theme.primaryColor} 0%, #0a0a0a 100%)`
          }}
          className="h-44 sm:h-52 relative px-6 py-6 flex flex-col justify-end border-b border-neutral-800"
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span
              style={{ borderColor: store.theme.accentColor, color: store.theme.accentColor }}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full border bg-neutral-950/60 backdrop-blur-sm"
            >
              {store.theme.bannerStyle.toUpperCase()} THEME
            </span>
            {store.badge && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500 text-neutral-950">
                {store.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
            <div className="flex items-end gap-4">
              <img
                src={store.avatarUrl}
                alt={store.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-neutral-700 bg-neutral-950 shadow-xl shrink-0"
              />
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>{store.name}</span>
                  {store.isVerified && <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />}
                </h1>
                <p className="text-xs text-neutral-300 font-medium">
                  {store.theme.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    {store.location}
                  </span>
                  <span>·</span>
                  <span className="text-amber-400 font-semibold">
                    ★ {store.rating} ({store.reviewsCount} avaliações)
                  </span>
                  <span>·</span>
                  <span className="font-mono text-neutral-300">
                    {store.totalSales} miniaturas enviadas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Ribbon */}
        {store.announcement && (
          <div className="bg-neutral-950/80 px-6 py-2.5 text-xs text-amber-300 flex items-center gap-2 border-b border-neutral-800">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{store.announcement}</span>
          </div>
        )}

        {/* Store Tabs */}
        <div className="px-6 flex border-b border-neutral-800 bg-neutral-900 gap-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3.5 transition-colors relative ${
              activeTab === 'catalog'
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Estoque da Loja ({storeItems.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`py-3.5 transition-colors relative ${
              activeTab === 'policies'
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Políticas de Envio & Segurança
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3.5 transition-colors relative ${
              activeTab === 'contact'
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Fazer Pergunta ao Vendedor
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              Estoque sincronizado em tempo real com o banco de dados oficial da LigaHot.
            </p>
            <span className="text-xs font-mono text-neutral-300">
              {storeItems.length} {storeItems.length === 1 ? 'miniatura ativa' : 'miniaturas ativas'}
            </span>
          </div>

          {storeItems.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
              <Package className="w-8 h-8 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">Nenhum produto cadastrado no momento</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Este lojista está preparando novos lotes para cadastro. Volte em breve ou use o Painel do Lojista se esta for sua loja.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {storeItems.map((listing) => {
                const min = miniatures.find(m => m.id === listing.miniatureId);
                if (!min) return null;

                const isBelowAvg = listing.price < min.avgPrice;
                const savingsPercent = Math.round(((min.avgPrice - listing.price) / min.avgPrice) * 100);

                return (
                  <div
                    key={listing.id}
                    onClick={() => setSelectedMiniatureId(min.id)}
                    className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-neutral-950 relative overflow-hidden">
                        <img
                          src={min.imageUrl}
                          alt={min.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-neutral-800">
                          {listing.condition}
                        </div>
                        {isBelowAvg && savingsPercent > 0 && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            -{savingsPercent}% vs Média
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[11px] text-neutral-400 block">
                          {min.brand} · {min.year} · {min.scale}
                        </span>
                        <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {min.name}
                        </h3>

                        <p className="text-xs text-neutral-400 line-clamp-2">
                          {listing.notes}
                        </p>

                        {/* Store Price vs Platform Price Guide comparison */}
                        <div className="pt-2 border-t border-neutral-800 space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[11px] text-neutral-400">Preço Nesta Loja:</span>
                            <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                              {formatPrice(listing.price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-500">
                            <span>Preço Médio da Liga:</span>
                            <span className="font-mono">{formatPrice(min.avgPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-400">
                        {listing.quantity} em estoque
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(listing, min);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Comprar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: POLICIES */}
      {activeTab === 'policies' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Padrão de Embalagem e Envio da Loja
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {store.shippingPolicies}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-white">Correios (PAC / Sedex)</h4>
              <p className="text-xs text-neutral-400">
                Postagem em até 24 a 48h úteis com código de rastreio automático enviado por e-mail e disponível no painel.
              </p>
            </div>
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-white">Transportadora Jadlog</h4>
              <p className="text-xs text-neutral-400">
                Opção mais rápida e econômica para capitais e regiões metropolitanas com seguro de carga 100%.
              </p>
            </div>
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-white">Proteção Anti-Amassados</h4>
              <p className="text-xs text-neutral-400">
                Miniaturas em blister ou caixa acrílica embaladas com plástico bolha de tripla camada e caixa resistente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CONTACT / INQUIRY */}
      {activeTab === 'contact' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-2xl mx-auto space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Tirar Dúvida Direto com o Lojista
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Pergunte sobre estado do blister, fotos adicionais ou combinação de frete para múltiplos itens.
            </p>
          </div>

          {sentSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Mensagem enviada com sucesso! O lojista receberá uma notificação no painel dele.</span>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Seu Nome ou Usuário</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Diecast"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Miniatura Referente</label>
                <select
                  value={inquiryItem}
                  onChange={(e) => setInquiryItem(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Dúvida Geral / Frete Combinado</option>
                  {storeItems.map(item => {
                    const min = miniatures.find(m => m.id === item.miniatureId);
                    return (
                      <option key={item.id} value={min?.name || ''}>
                        {min?.name || item.id}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Sua Mensagem</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ex: Gostaria de saber se a cartela tem algum vinco nas pontas ou se o acrílico está sem riscos..."
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Pergunta ao Lojista</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
