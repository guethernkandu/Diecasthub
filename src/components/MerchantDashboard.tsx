import React, { useState } from 'react';
import {
  Store as StoreIcon,
  Package,
  TrendingUp,
  Truck,
  MessageSquare,
  Palette,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  Send,
  Trash2,
  Edit2,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Condition } from '../types';

export const MerchantDashboard: React.FC = () => {
  const {
    userStore,
    updateUserStore,
    storeListings,
    addStoreListing,
    updateStoreListing,
    removeStoreListing,
    miniatures,
    userStoreOrders,
    updateOrderStatus,
    userStoreInquiries,
    replyToInquiry,
    formatPrice,
    setActiveSubdomain,
    setCurrentTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'inquiries' | 'customizer'>('overview');

  // Customizer form state
  const [storeName, setStoreName] = useState(userStore.name);
  const [subdomainSlug, setSubdomainSlug] = useState(userStore.subdomain);
  const [tagline, setTagline] = useState(userStore.theme.tagline);
  const [announcement, setAnnouncement] = useState(userStore.announcement);
  const [bio, setBio] = useState(userStore.bio);
  const [primaryColor, setPrimaryColor] = useState(userStore.theme.primaryColor);
  const [accentColor, setAccentColor] = useState(userStore.theme.accentColor);
  const [bannerStyle, setBannerStyle] = useState(userStore.theme.bannerStyle);
  const [shippingPolicies, setShippingPolicies] = useState(userStore.shippingPolicies);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New inventory item form state
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [selectedMiniatureId, setSelectedMiniatureId] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingQty, setListingQty] = useState('1');
  const [listingCondition, setListingCondition] = useState<Condition>('Caixa Acrílica Lacrada');
  const [listingNotes, setListingNotes] = useState('');

  // Shipping code update modal
  const [trackingModalOrder, setTrackingModalOrder] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Inquiry reply state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Listings belonging to this user store
  const myListings = storeListings.filter(l => l.storeId === userStore.id);

  // Stats calculation
  const totalRevenue = userStoreOrders
    .filter(o => o.status !== 'Aguardando Pagamento')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingShipments = userStoreOrders.filter(o => o.status === 'Preparando Envio').length;
  const pendingInquiries = userStoreInquiries.filter(i => !i.reply).length;

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserStore({
      name: storeName,
      subdomain: subdomainSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      bio,
      announcement,
      shippingPolicies,
      theme: {
        primaryColor,
        accentColor,
        bannerStyle,
        tagline
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMiniatureId || !listingPrice) return;

    addStoreListing({
      miniatureId: selectedMiniatureId,
      price: parseFloat(listingPrice),
      quantity: parseInt(listingQty) || 1,
      condition: listingCondition,
      notes: listingNotes || 'Item em excelente estado de conservação, embalado com proteção reforçada.'
    });

    setIsAddListingOpen(false);
    setSelectedMiniatureId('');
    setListingPrice('');
    setListingQty('1');
    setListingNotes('');
  };

  const handleQuickMatchLowestPrice = (minId: string) => {
    const min = miniatures.find(m => m.id === minId);
    if (min) {
      setListingPrice(min.lowestPrice.toString());
    }
  };

  const handleUpdateTracking = (orderId: string) => {
    if (!trackingInput.trim()) return;
    updateOrderStatus(orderId, 'Enviado', trackingInput.trim());
    setTrackingModalOrder(null);
    setTrackingInput('');
  };

  const handleSendReply = (inquiryId: string) => {
    const text = replyInputs[inquiryId];
    if (!text || !text.trim()) return;
    replyToInquiry(inquiryId, text);
    setReplyInputs(prev => ({ ...prev, [inquiryId]: '' }));
  };

  // Color preset options
  const THEME_PRESETS = [
    { name: 'Racing Gold', primary: '#0f172a', accent: '#f59e0b', style: 'racing' as const },
    { name: 'Gulf Blue & Orange', primary: '#0369a1', accent: '#f97316', style: 'carbon' as const },
    { name: 'Midnight Purple JDM', primary: '#2e1065', accent: '#ec4899', style: 'gradient' as const },
    { name: 'Advan Crimson Racing', primary: '#18181b', accent: '#ef4444', style: 'checkered' as const },
    { name: 'British Racing Green', primary: '#064e3b', accent: '#10b981', style: 'racing' as const }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Live Store Preview Link */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <StoreIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Painel de Gestão da Loja
            </h1>
          </div>
          <p className="text-xs text-neutral-400">
            Gerencie seu estoque integrado, acompanhe vendas, emita envios e customize sua identidade visual.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveSubdomain(userStore.subdomain);
            setCurrentTab('stores');
          }}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow"
        >
          <span>Visualizar Loja Online</span>
          <span className="font-mono text-[11px] underline">({userStore.subdomain}.ligahot.com.br)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-800 gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Visão Geral & Vendas</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestão de Estoque ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Envios & Pedidos</span>
          {pendingShipments > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-mono">
              {pendingShipments}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'inquiries'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Central de Dúvidas</span>
          {pendingInquiries > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono">
              {pendingInquiries}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('customizer')}
          className={`pb-3 whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'customizer'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Personalizar Loja & Subdomínio</span>
        </button>
      </div>

      {/* 1. OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase">Faturamento Total</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {formatPrice(totalRevenue)}
              </div>
              <span className="text-[11px] text-neutral-500">Pedidos pagos e confirmados</span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase">Pedidos Recebidos</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                {userStoreOrders.length}
              </div>
              <span className="text-[11px] text-neutral-500">{pendingShipments} aguardando postagem</span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase">Itens Anunciados</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
                {myListings.length}
              </div>
              <span className="text-[11px] text-neutral-500">Integrados ao guia de preços</span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase">Reputação do Vendedor</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tabular-nums">
                ★ {userStore.rating}
              </div>
              <span className="text-[11px] text-neutral-500">Baseado em {userStore.reviewsCount} avaliações</span>
            </div>
          </div>

          {/* Recent Orders List Preview */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Últimas Vendas da Sua Loja</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-medium text-amber-400 hover:underline"
              >
                Gerenciar Todos os Envios &rarr;
              </button>
            </div>

            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden text-xs">
              {userStoreOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{order.id}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-300">{order.customerName} ({order.customerCity})</span>
                    </div>
                    <p className="text-neutral-400 text-[11px]">
                      {order.items.map(i => `${i.qty}x ${i.miniatureName}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatPrice(order.total)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      order.status === 'Entregue'
                        ? 'bg-emerald-950 text-emerald-400'
                        : order.status === 'Enviado'
                        ? 'bg-blue-950 text-blue-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. INVENTORY MANAGEMENT (Integrated with Platform Master Database) */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                Estoque Sincronizado com a LigaHot
              </h3>
              <p className="text-xs text-neutral-400">
                Seus preços e condições são refletidos automaticamente no comparador da página de cada miniatura.
              </p>
            </div>

            <button
              onClick={() => setIsAddListingOpen(true)}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Miniatura ao Estoque</span>
            </button>
          </div>

          {/* Listings Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950 font-semibold">
                    <th className="py-3 px-4">Miniatura Catalogada</th>
                    <th className="py-3 px-4">Condição do Blister</th>
                    <th className="py-3 px-4 text-center">Qtd</th>
                    <th className="py-3 px-4 text-right">Seu Preço</th>
                    <th className="py-3 px-4 text-right">Média LigaHot</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {myListings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500 text-xs">
                        Você ainda não cadastrou miniaturas à venda. Clique no botão acima para adicionar!
                      </td>
                    </tr>
                  ) : (
                    myListings.map((item) => {
                      const min = miniatures.find(m => m.id === item.miniatureId);
                      if (!min) return null;

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
                                <span className="font-semibold text-white block">
                                  {min.name}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  {min.brand} · {min.year} · {min.series}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-200">
                              {item.condition}
                            </span>
                            <span className="text-[10px] text-neutral-500 block truncate max-w-xs mt-0.5">
                              {item.notes}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center font-mono text-neutral-300">
                            {item.quantity} un.
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                            {formatPrice(item.price)}
                          </td>

                          <td className="py-3 px-4 text-right font-mono text-neutral-400 text-xs">
                            {formatPrice(min.avgPrice)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => removeStoreListing(item.id)}
                              className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                              title="Remover do estoque"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDERS & SHIPMENTS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Rastreamento & Despacho de Pedidos
            </h3>
            <p className="text-xs text-neutral-400">
              Atualize o status dos pedidos para manter o comprador informado por e-mail e na conta da LigaHot.
            </p>
          </div>

          <div className="space-y-4">
            {userStoreOrders.map((order) => (
              <div
                key={order.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {order.id}
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-xs text-neutral-400">Data: {order.date}</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-xs text-white font-medium">{order.customerName}</span>
                  </div>

                  {/* Status Stepper */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {(['Aguardando Pagamento', 'Preparando Envio', 'Enviado', 'Entregue'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(order.id, st)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          order.status === st
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'bg-neutral-950 text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items & Shipping Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-neutral-500 block">Itens Comprados:</span>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-neutral-300">
                        <span>{it.qty}x {it.miniatureName} ({it.condition})</span>
                        <span className="font-mono text-emerald-400">{formatPrice(it.price * it.qty)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-neutral-800/80 flex justify-between font-bold text-white">
                      <span>Total do Pedido:</span>
                      <span className="font-mono text-emerald-400">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Código de Rastreio:</span>
                      {order.trackingCode ? (
                        <span className="font-mono text-amber-400 font-bold">{order.trackingCode}</span>
                      ) : (
                        <span className="text-neutral-500 italic">Pendente</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Destino:</span>
                      <span className="text-white">{order.customerCity}</span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setTrackingModalOrder(order.id);
                          setTrackingInput(order.trackingCode || '');
                        }}
                        className="w-full py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs transition-colors"
                      >
                        {order.trackingCode ? 'Editar Código de Rastreio' : 'Inserir Código de Rastreio (Correios / Jadlog)'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INQUIRIES & CUSTOMER MESSAGES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Perguntas e Dúvidas de Compradores
            </h3>
            <p className="text-xs text-neutral-400">
              Responda dúvidas sobre as peças para fechar negociações mais rapidamente.
            </p>
          </div>

          <div className="space-y-4">
            {userStoreInquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{inq.customerName}</span>
                    <span className="text-neutral-500">perguntou sobre</span>
                    <span className="text-amber-400 font-semibold">{inq.miniatureName}</span>
                  </div>
                  <span className="font-mono text-neutral-500 text-[11px]">{inq.date}</span>
                </div>

                <div className="p-3 bg-neutral-950 rounded-lg text-xs text-neutral-300 border border-neutral-800/80">
                  "{inq.message}"
                </div>

                {inq.reply ? (
                  <div className="p-3 bg-amber-500/10 rounded-lg text-xs text-amber-200 border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400/80">
                      <span>Sua Resposta:</span>
                      <span>{inq.repliedDate}</span>
                    </div>
                    <p>"{inq.reply}"</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      placeholder="Digite sua resposta para o comprador..."
                      value={replyInputs[inq.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [inq.id]: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleSendReply(inq.id)}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Resposta ao Cliente</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STOREFRONT CUSTOMIZER (THEMES & BRANDING) */}
      {activeTab === 'customizer' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-500" />
                Personalização Visual & Identidade da Loja
              </h3>
              <p className="text-xs text-neutral-400">
                Configure as cores, estilo de banner, anúncio de destaque e o endereço da sua loja na web.
              </p>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Alterações salvas com sucesso!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveCustomization} className="space-y-6 text-xs">
            {/* Store URL & Subdomain Slug */}
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
              <label className="block text-neutral-300 font-bold text-sm">
                Endereço Web da Sua Loja (Subdomínio LigaHot)
              </label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden focus-within:border-amber-500">
                <span className="px-3 py-2.5 text-neutral-500 font-mono bg-neutral-950 border-r border-neutral-800">
                  https://
                </span>
                <input
                  type="text"
                  required
                  value={subdomainSlug}
                  onChange={(e) => setSubdomainSlug(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2.5 text-amber-400 font-mono font-bold focus:outline-none"
                />
                <span className="px-3 py-2.5 text-neutral-400 font-mono bg-neutral-950 border-l border-neutral-800">
                  .ligahot.com.br
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Seus clientes poderão acessar sua loja diretamente através deste link exclusivo!
              </p>
            </div>

            {/* Basic Store Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Nome da Loja</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Slogan / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Theme Presets */}
            <div className="space-y-2">
              <label className="block text-neutral-300 font-semibold">
                Estilo Visual & Presets de Cores
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setAccentColor(preset.accent);
                      setBannerStyle(preset.style);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      primaryColor === preset.primary && accentColor === preset.accent
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-neutral-950'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span style={{ backgroundColor: preset.primary }} className="w-4 h-4 rounded-full border border-neutral-700" />
                      <span style={{ backgroundColor: preset.accent }} className="w-4 h-4 rounded-full border border-neutral-700" />
                    </div>
                    <span className="font-semibold text-white text-[11px]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Announcement Banner */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Faixa de Anúncio / Promoção no Topo da Loja
              </label>
              <input
                type="text"
                placeholder="Ex: Frete Grátis nas compras acima de R$ 299 para o Sudeste..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Bio & Shipping Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Sobre a Loja / Biografia</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Políticas de Envio e Embalagem</label>
                <textarea
                  rows={3}
                  value={shippingPolicies}
                  onChange={(e) => setShippingPolicies(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações da Loja</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD LISTING TO INVENTORY */}
      {isAddListingOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              Anunciar Miniatura no Seu Estoque
            </h3>
            <p className="text-xs text-neutral-400">
              Escolha uma peça do catálogo master da LigaHot. O preço médio do mercado será exibido para te guiar na precificação.
            </p>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Selecione a Miniatura no Banco Oficial
                </label>
                <select
                  required
                  value={selectedMiniatureId}
                  onChange={(e) => {
                    setSelectedMiniatureId(e.target.value);
                    const found = miniatures.find(m => m.id === e.target.value);
                    if (found) {
                      setListingPrice(found.lowestPrice.toString());
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecione um modelo...</option>
                  {miniatures.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.brand} {m.year}) - Média: R$ {m.avgPrice}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMiniatureId && (
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
                  {(() => {
                    const min = miniatures.find(m => m.id === selectedMiniatureId);
                    if (!min) return null;
                    return (
                      <>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400">Menor Preço da Liga:</span>
                          <span className="font-mono text-emerald-400 font-bold">{formatPrice(min.lowestPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400">Preço Médio de Mercado:</span>
                          <span className="font-mono text-amber-300 font-bold">{formatPrice(min.avgPrice)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickMatchLowestPrice(min.id)}
                          className="w-full py-1 text-[11px] font-semibold text-amber-400 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800"
                        >
                          ⚡ Igualar ao Menor Preço da Liga ({formatPrice(min.lowestPrice)})
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Seu Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 245.00"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Quantidade em Estoque</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={listingQty}
                    onChange={(e) => setListingQty(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Estado de Conservação</label>
                <select
                  value={listingCondition}
                  onChange={(e) => setListingCondition(e.target.value as Condition)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="Caixa Acrílica Lacrada">Caixa Acrílica Lacrada</option>
                  <option value="Lacrado / Blister Perfeito">Lacrado / Blister Perfeito</option>
                  <option value="Blister C-8 (Leve detalhe no cartão)">Blister C-8 (Leve detalhe no cartão)</option>
                  <option value="Loose / Solto Perfeito">Loose / Solto Perfeito</option>
                  <option value="Loose com Detalhe">Loose com Detalhe</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Observações do Vendedor</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Acompanha protetor em acrílico 3mm, blister 100% liso sem marcas de dobra..."
                  value={listingNotes}
                  onChange={(e) => setListingNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddListingOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Publicar no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TRACKING CODE */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-500" />
              Código de Rastreio ({trackingModalOrder})
            </h3>
            <p className="text-xs text-neutral-400">
              Digite o código de rastreamento dos Correios (ex: BR123456789BR) ou Jadlog.
            </p>

            <input
              type="text"
              placeholder="Ex: NL194820184BR"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
              className="w-full bg-neutral-950 border border-neutral-800 text-amber-400 font-mono font-bold p-2.5 rounded-lg focus:outline-none focus:border-amber-500 uppercase"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="flex-1 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateTracking(trackingModalOrder)}
                className="flex-1 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400"
              >
                Salvar e Atualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
