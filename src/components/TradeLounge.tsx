import React, { useState } from 'react';
import {
  MessageCircle,
  Heart,
  Repeat,
  Sparkles,
  Share2,
  Send,
  Plus,
  Image,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityPost, TradeOffer } from '../types';

export const TradeLounge: React.FC = () => {
  const {
    communityPosts,
    toggleLikePost,
    addCommentToPost,
    createCommunityPost,
    submitTradeOffer,
    respondToTradeOffer,
    miniatures,
    userCollection,
    setSelectedMiniatureId
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'trade' | 'mail_call' | 'showcase'>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Create post modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'showcase' | 'trade_wtt' | 'mail_call'>('trade_wtt');
  const [taggedMinId, setTaggedMinId] = useState('');

  // Propose trade modal state
  const [proposingPostId, setProposingPostId] = useState<string | null>(null);
  const [offeredItemFromGarage, setOfferedItemFromGarage] = useState('');
  const [cashDifference, setCashDifference] = useState('');
  const [tradeProposalMessage, setTradeProposalMessage] = useState('');

  const filteredPosts = communityPosts.filter(p => {
    if (activeFilter === 'trade') return p.type === 'trade_wtt';
    if (activeFilter === 'mail_call') return p.type === 'mail_call';
    if (activeFilter === 'showcase') return p.type === 'showcase';
    return true;
  });

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    createCommunityPost(newContent, newType, taggedMinId || undefined);
    setIsCreateOpen(false);
    setNewContent('');
    setTaggedMinId('');
  };

  const handleSendTradeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposingPostId || !offeredItemFromGarage) return;

    const offerTitle = cashDifference
      ? `${offeredItemFromGarage} + R$ ${cashDifference} no PIX`
      : offeredItemFromGarage;

    submitTradeOffer(proposingPostId, {
      fromUser: 'Você (@colecionador_oficial)',
      fromUserAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      offeredItemName: offerTitle,
      offeredItemBrand: 'Coleção Particular',
      offeredItemCondition: 'Lacrado / Perfeito',
      message: tradeProposalMessage || 'Olá amigo, veja minha proposta de troca!'
    });

    setProposingPostId(null);
    setOfferedItemFromGarage('');
    setCashDifference('');
    setTradeProposalMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header & Post Creator CTA */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Repeat className="w-6 h-6 text-amber-500" />
              Lounge de Trocas & Vitrine Diecast
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              A comunidade brasileira de colecionadores: apresente aquisições recentes, proponha permutas e negocie peças raras.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Post / Proposta</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-neutral-800 text-amber-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todos os Posts
          </button>
          <button
            onClick={() => setActiveFilter('trade')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === 'trade'
                ? 'bg-neutral-800 text-amber-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Propostas de Troca (WTT)</span>
          </button>
          <button
            onClick={() => setActiveFilter('mail_call')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === 'mail_call'
                ? 'bg-neutral-800 text-amber-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mail Call / Chegadas</span>
          </button>
          <button
            onClick={() => setActiveFilter('showcase')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'showcase'
                ? 'bg-neutral-800 text-amber-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Vitrines & Garagens
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-5"
          >
            {/* Post Author Lockup */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700 bg-neutral-950"
                />
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {post.authorName}
                    <span className="text-neutral-500 font-normal text-xs">{post.authorHandle}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <span>{post.authorCity}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {post.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Type Badge */}
              <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
                post.type === 'trade_wtt'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : post.type === 'mail_call'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}>
                {post.type === 'trade_wtt' ? 'TROCA / WTT' : post.type === 'mail_call' ? 'MAIL CALL' : 'VITRINE'}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {post.content}
            </p>

            {/* Tagged Miniature Card */}
            {post.taggedMiniatureId && (
              <div
                onClick={() => setSelectedMiniatureId(post.taggedMiniatureId!)}
                className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Tag className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-white group-hover:text-amber-400 truncate">
                    {post.taggedMiniatureName || 'Miniatura Catalogada'}
                  </span>
                </div>
                <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1 shrink-0">
                  Ver Cotação &rarr;
                </span>
              </div>
            )}

            {/* Post Image */}
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 max-h-96">
                <img
                  src={post.imageUrl}
                  alt="Post visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Trade Offers Section (if type is trade_wtt) */}
            {post.type === 'trade_wtt' && (
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5" />
                    Propostas de Permuta Registradas ({post.tradeOffers?.length || 0})
                  </span>
                  <button
                    onClick={() => setProposingPostId(post.id)}
                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
                  >
                    Fazer Proposta de Troca
                  </button>
                </div>

                {post.tradeOffers && post.tradeOffers.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {post.tradeOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-white block">{offer.fromUser}</span>
                          <span className="text-amber-300 font-medium">{offer.offeredItemName}</span>
                          <p className="text-[11px] text-neutral-400 italic">"{offer.message}"</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {offer.status === 'accepted' ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Proposta Aceita
                            </span>
                          ) : offer.status === 'declined' ? (
                            <span className="text-xs text-neutral-500 font-medium">Recusada</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => respondToTradeOffer(post.id, offer.id, 'accepted')}
                                className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500"
                              >
                                Aceitar
                              </button>
                              <button
                                onClick={() => respondToTradeOffer(post.id, offer.id, 'declined')}
                                className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[11px] hover:text-white"
                              >
                                Recusar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 italic">
                    Nenhuma proposta enviada ainda. Seja o primeiro a ofertar uma peça da sua garagem!
                  </p>
                )}
              </div>
            )}

            {/* Social Actions (Likes & Comment Count) */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
              <button
                onClick={() => toggleLikePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.likedByCurrentUser ? 'text-red-400 font-bold' : 'hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.likesCount} Curtidas</span>
              </button>

              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-neutral-500" />
                <span>{post.comments.length} Comentários</span>
              </span>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                {post.comments.map((comm) => (
                  <div key={comm.id} className="p-2.5 rounded-lg bg-neutral-950/60 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-300">{comm.author}</span>
                      <span className="text-[10px] text-neutral-500">{comm.time}</span>
                    </div>
                    <p className="text-neutral-400">{comm.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Escreva um comentário ou tire uma dúvida sobre a peça..."
                value={commentInputs[post.id] || ''}
                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommentSubmit(post.id);
                }}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 transition-colors"
                aria-label="Enviar comentário"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* MODAL: CREATE NEW POST */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Criar Publicação no Lounge
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Tipo de Publicação</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('trade_wtt')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newType === 'trade_wtt'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Proposta de Troca
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('mail_call')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newType === 'mail_call'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Mail Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('showcase')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newType === 'showcase'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Vitrine Geral
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Vincular Miniatura do Catálogo Oficial
                </label>
                <select
                  value={taggedMinId}
                  onChange={(e) => setTaggedMinId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Nenhuma miniatura vinculada...</option>
                  {miniatures.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.brand})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Mensagem do Post</label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    newType === 'trade_wtt'
                      ? 'Descreva o que você tem e o que procura na troca (ex: Tenho Datsun 510 Kaido House lacrado, procuro RLC Skyline ou TLV Porsche)...'
                      : 'Compartilhe sua nova peça ou foto da sua coleção com a comunidade...'
                  }
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Publicar no Lounge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROPOSE TRADE OFFER */}
      {proposingPostId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Repeat className="w-5 h-5 text-amber-500" />
                Fazer Proposta de Troca
              </h3>
              <button
                onClick={() => setProposingPostId(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendTradeOffer} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Item da Sua Garagem para Ofertar
                </label>
                <select
                  required
                  value={offeredItemFromGarage}
                  onChange={(e) => setOfferedItemFromGarage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Escolha um item da sua coleção...</option>
                  {userCollection.map(c => (
                    <option key={c.id} value={`${c.miniature.name} (${c.condition})`}>
                      {c.miniature.name} - {c.condition} (Média R$ {c.miniature.avgPrice})
                    </option>
                  ))}
                  <option value="Mini GT LB-Silhouette 350Z Formula Drift">Mini GT LB-Silhouette 350Z (Lacrado)</option>
                  <option value="Hot Wheels RLC 1999 Skyline GT-R R34">Hot Wheels RLC Skyline R34 (Na Caixa Acrílica)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Volta em Dinheiro no PIX (Opcional - R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 50.00"
                  value={cashDifference}
                  onChange={(e) => setCashDifference(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Mensagem para o Colecionador
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Minha peça está 100% lacrada sem vincos. Posso mandar fotos pelo chat e pagar o frete via Sedex..."
                  value={tradeProposalMessage}
                  onChange={(e) => setTradeProposalMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProposingPostId(null)}
                  className="flex-1 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Enviar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
