import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    checkout
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [buyerName, setBuyerName] = useState('Rodrigo Silveira');
  const [buyerEmail, setBuyerEmail] = useState('rodrigo.collector@gmail.com');
  const [buyerCity, setBuyerCity] = useState('São Paulo, SP');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCartOpen) return null;

  // Group cart items by store
  const storeGroups = cart.reduce((groups, item) => {
    const sId = item.listing.storeId;
    if (!groups[sId]) {
      groups[sId] = {
        storeName: item.listing.storeName,
        storeSubdomain: item.listing.storeSubdomain,
        items: []
      };
    }
    groups[sId].items.push(item);
    return groups;
  }, {} as Record<string, { storeName: string; storeSubdomain: string; items: typeof cart }>);

  const subtotal = cart.reduce((sum, item) => sum + item.listing.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? (subtotal > 299 ? 0 : 28.0) : 0;
  const grandTotal = subtotal + shippingFee;

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `LIGA-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedId);
    checkout({
      name: buyerName,
      email: buyerEmail,
      city: buyerCity,
      paymentMethod
    });
    setCheckoutStep('success');
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                {checkoutStep === 'cart' && `Carrinho de Compras (${cart.length})`}
                {checkoutStep === 'checkout' && 'Finalizar Pedido'}
                {checkoutStep === 'success' && 'Pedido Confirmado!'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {checkoutStep === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                    <h3 className="text-sm font-bold text-white">Seu carrinho está vazio</h3>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                      Navegue pelo catálogo e adicione miniaturas direto das melhores lojas parceiras.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Items grouped by store */}
                    {Object.entries(storeGroups).map(([storeId, group]) => (
                      <div key={storeId} className="space-y-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            {group.storeName}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {group.storeSubdomain}.ligahot.com.br
                          </span>
                        </div>

                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <div key={item.listing.id} className="flex gap-3 text-xs">
                              <img
                                src={item.miniature.imageUrl}
                                alt={item.miniature.name}
                                referrerPolicy="no-referrer"
                                className="w-14 h-11 object-cover rounded bg-neutral-900 border border-neutral-800 shrink-0"
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="font-semibold text-white truncate">
                                  {item.miniature.name}
                                </h4>
                                <span className="text-[11px] text-neutral-400 block">
                                  {item.listing.condition}
                                </span>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="font-mono font-bold text-emerald-400">
                                    {formatPrice(item.listing.price)}
                                  </span>
                                  {/* Stepper */}
                                  <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5">
                                    <button
                                      onClick={() => updateCartQuantity(item.listing.id, item.quantity - 1)}
                                      className="text-neutral-400 hover:text-white"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-mono text-[11px] px-1 text-white">{item.quantity}</span>
                                    <button
                                      onClick={() => updateCartQuantity(item.listing.id, item.quantity + 1)}
                                      className="text-neutral-400 hover:text-white"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* CHECKOUT STEP */}
            {checkoutStep === 'checkout' && (
              <form onSubmit={handleProcessCheckout} className="space-y-4 text-xs">
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-xs uppercase text-neutral-400 tracking-wider">
                    Dados de Envio & Entrega
                  </h3>
                  <div>
                    <label className="block text-neutral-300 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1">E-mail para Rastreio</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1">Cidade / UF de Destino</label>
                    <input
                      type="text"
                      required
                      value={buyerCity}
                      onChange={(e) => setBuyerCity(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <h3 className="font-bold text-white text-xs uppercase text-neutral-400 tracking-wider">
                    Forma de Pagamento
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2 ${
                        paymentMethod === 'pix'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-white">PIX Imediato</span>
                        <span className="text-[10px] text-emerald-400">Desconto de 5%</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cartao')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2 ${
                        paymentMethod === 'cartao'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-white">Cartão</span>
                        <span className="text-[10px] text-neutral-400">Até 6x s/ juros</span>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar e Pagar ({formatPrice(grandTotal)})</span>
                </button>
              </form>
            )}

            {/* SUCCESS STEP */}
            {checkoutStep === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Pagamento Aprovado com Sucesso!</h3>
                  <p className="font-mono text-xs text-amber-400">Pedido #{orderNumber}</p>
                </div>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
                  As lojas parceiras já receberam a notificação e iniciaram a preparação das embalagens reforçadas. O código de rastreio será enviado para <strong className="text-white">{buyerEmail}</strong>.
                </p>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-left text-xs space-y-1.5">
                  <span className="text-[11px] text-neutral-400 font-semibold block">Garantia LigaHot:</span>
                  <p className="text-[11px] text-neutral-500">
                    Seu pagamento fica retido em custódia segura até que a miniatura chegue em suas mãos exatamente na condição descrita.
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
                >
                  Continuar Colecionando
                </button>
              </div>
            )}
          </div>

          {/* Footer Subtotals */}
          {checkoutStep === 'cart' && cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal dos Itens:</span>
                  <span className="font-mono font-medium text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Frete Combinado:</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-bold">Grátis</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Geral:</span>
                  <span className="font-mono text-emerald-400 text-base">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <span>Avançar para Checkout Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
