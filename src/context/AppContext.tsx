import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Miniature,
  Store,
  StoreListing,
  CollectionItem,
  WishlistItem,
  CommunityPost,
  CartItem,
  StoreOrder,
  StoreInquiry,
  Brand,
  TradeOffer,
  Condition
} from '../types';
import {
  MASTER_MINIATURES,
  INITIAL_STORES,
  INITIAL_STORE_LISTINGS,
  INITIAL_USER_COLLECTION,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_STORE_ORDERS,
  INITIAL_STORE_INQUIRIES
} from '../data/mockData';

interface AppContextType {
  // Navigation & Subdomains
  activeSubdomain: string | null;
  setActiveSubdomain: (subdomain: string | null) => void;
  currentTab: 'marketplace' | 'price-guide' | 'collection' | 'community' | 'stores' | 'my-store-dashboard';
  setCurrentTab: (tab: 'marketplace' | 'price-guide' | 'collection' | 'community' | 'stores' | 'my-store-dashboard') => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBrand: Brand | 'Todos';
  setSelectedBrand: (b: Brand | 'Todos') => void;
  selectedMiniatureId: string | null;
  setSelectedMiniatureId: (id: string | null) => void;
  
  // Database & Listings
  miniatures: Miniature[];
  stores: Store[];
  storeListings: StoreListing[];
  addStoreListing: (listing: Omit<StoreListing, 'id' | 'storeId' | 'storeName' | 'storeSubdomain' | 'storeRating' | 'storeSalesCount' | 'storeOriginState' | 'isVerified'>) => void;
  updateStoreListing: (id: string, updates: Partial<StoreListing>) => void;
  removeStoreListing: (id: string) => void;
  
  // User's Own Store Customization & Dashboard
  userStore: Store;
  updateUserStore: (updates: Partial<Store>) => void;
  userStoreOrders: StoreOrder[];
  updateOrderStatus: (orderId: string, status: StoreOrder['status'], trackingCode?: string) => void;
  userStoreInquiries: StoreInquiry[];
  replyToInquiry: (inquiryId: string, replyText: string) => void;
  
  // User Collection & Wishlist
  userCollection: CollectionItem[];
  addToCollection: (miniatureId: string, condition: Condition, purchasePrice: number, notes?: string) => void;
  removeFromCollection: (id: string) => void;
  toggleForTrade: (id: string) => void;
  userWishlist: WishlistItem[];
  addToWishlist: (miniatureId: string, targetPrice: number, notes?: string) => void;
  removeFromWishlist: (id: string) => void;
  
  // Social Lounge & Trades
  communityPosts: CommunityPost[];
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  createCommunityPost: (content: string, type: 'showcase' | 'trade_wtt' | 'mail_call', taggedMiniatureId?: string, imageUrl?: string) => void;
  submitTradeOffer: (postId: string, offer: Omit<TradeOffer, 'id' | 'status' | 'date'>) => void;
  respondToTradeOffer: (postId: string, offerId: string, status: 'accepted' | 'declined') => void;
  
  // Shopping Cart & Checkout
  cart: CartItem[];
  addToCart: (listing: StoreListing, miniature: Miniature) => void;
  updateCartQuantity: (listingId: string, qty: number) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkout: (customerData: { name: string; email: string; city: string; paymentMethod: string }) => boolean;
  
  // Currency Toggle (BRL default, USD optional)
  currency: 'BRL' | 'USD';
  setCurrency: (c: 'BRL' | 'USD') => void;
  formatPrice: (amountInBRL: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSubdomain, setActiveSubdomain] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'price-guide' | 'collection' | 'community' | 'stores' | 'my-store-dashboard'>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'Todos'>('Todos');
  const [selectedMiniatureId, setSelectedMiniatureId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<'BRL' | 'USD'>('BRL');

  const [miniatures] = useState<Miniature[]>(MASTER_MINIATURES);
  const [storeListings, setStoreListings] = useState<StoreListing[]>(INITIAL_STORE_LISTINGS);

  // User's own store setup
  const [userStore, setUserStore] = useState<Store>({
    id: 'store-my-custom-garage',
    name: 'Garagem do Colecionador BR',
    subdomain: 'colecionador-br',
    ownerName: 'Você (Colecionador Oficial)',
    rating: 4.95,
    reviewsCount: 54,
    totalSales: 138,
    location: 'São Paulo, SP',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Minha loja oficial dentro da LigaHot! Miniaturas selecionadas direto da coleção, lacradas ou loose em estado de museu.',
    announcement: '🚀 Bem-vindo à minha loja! Envio para todo o Brasil com embalagem à prova de impacto.',
    isVerified: true,
    joinedYear: 2024,
    shippingPolicies: 'Envios nas segundas e quintas via Correios e Jadlog. Desconto de 5% no PIX.',
    theme: {
      primaryColor: '#0f172a',
      accentColor: '#f59e0b',
      bannerStyle: 'racing',
      tagline: 'Miniaturas Raras, RLCs e JDM com Garantia de Colecionador'
    }
  });

  const [stores, setStores] = useState<Store[]>([...INITIAL_STORES, userStore]);
  const [userStoreOrders, setUserStoreOrders] = useState<StoreOrder[]>(INITIAL_STORE_ORDERS);
  const [userStoreInquiries, setUserStoreInquiries] = useState<StoreInquiry[]>(INITIAL_STORE_INQUIRIES);

  // User personal collection & wishlist
  const [userCollection, setUserCollection] = useState<CollectionItem[]>(INITIAL_USER_COLLECTION);
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([
    {
      id: 'wish-1',
      miniatureId: 'hw-rlc-skyline-r34',
      miniature: MASTER_MINIATURES[1],
      targetPrice: 650.0,
      addedDate: '2026-09-01',
      notes: 'Buscando exemplar lacrado com caixa marrom shipper.'
    },
    {
      id: 'wish-2',
      miniatureId: 'inno64-civic-ferio-vi-rs',
      miniature: MASTER_MINIATURES[5],
      targetPrice: 200.0,
      addedDate: '2026-09-15',
      notes: 'Alerta de preço ativado para menor oferta abaixo de R$ 200.'
    }
  ]);

  // Social Lounge
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Shopping Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Keep stores list in sync when userStore updates
  useEffect(() => {
    setStores(prev => {
      const filtered = prev.filter(s => s.id !== userStore.id);
      return [...filtered, userStore];
    });
  }, [userStore]);

  const updateUserStore = (updates: Partial<Store>) => {
    setUserStore(prev => ({
      ...prev,
      ...updates,
      theme: updates.theme ? { ...prev.theme, ...updates.theme } : prev.theme
    }));
  };

  const addStoreListing = (newListingData: Omit<StoreListing, 'id' | 'storeId' | 'storeName' | 'storeSubdomain' | 'storeRating' | 'storeSalesCount' | 'storeOriginState' | 'isVerified'>) => {
    const newListing: StoreListing = {
      ...newListingData,
      id: `list-user-${Date.now()}`,
      storeId: userStore.id,
      storeName: userStore.name,
      storeSubdomain: userStore.subdomain,
      storeRating: userStore.rating,
      storeSalesCount: userStore.totalSales,
      storeOriginState: userStore.location.split(',')[1]?.trim() || 'SP',
      isVerified: userStore.isVerified
    };
    setStoreListings(prev => [newListing, ...prev]);
  };

  const updateStoreListing = (id: string, updates: Partial<StoreListing>) => {
    setStoreListings(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeStoreListing = (id: string) => {
    setStoreListings(prev => prev.filter(item => item.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: StoreOrder['status'], trackingCode?: string) => {
    setUserStoreOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          ...(trackingCode ? { trackingCode } : {})
        };
      }
      return o;
    }));
  };

  const replyToInquiry = (inquiryId: string, replyText: string) => {
    setUserStoreInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          reply: replyText,
          repliedDate: 'Hoje às 15:30'
        };
      }
      return inq;
    }));
  };

  const addToCollection = (miniatureId: string, condition: Condition, purchasePrice: number, notes = '') => {
    const min = miniatures.find(m => m.id === miniatureId);
    if (!min) return;
    const newItem: CollectionItem = {
      id: `col-${Date.now()}`,
      miniatureId,
      miniature: min,
      condition,
      acquiredDate: new Date().toISOString().split('T')[0],
      purchasePrice,
      currentMarketPrice: min.avgPrice,
      isForTrade: false,
      userNotes: notes
    };
    setUserCollection(prev => [newItem, ...prev]);
  };

  const removeFromCollection = (id: string) => {
    setUserCollection(prev => prev.filter(c => c.id !== id));
  };

  const toggleForTrade = (id: string) => {
    setUserCollection(prev => prev.map(c => c.id === id ? { ...c, isForTrade: !c.isForTrade } : c));
  };

  const addToWishlist = (miniatureId: string, targetPrice: number, notes = '') => {
    const min = miniatures.find(m => m.id === miniatureId);
    if (!min) return;
    const item: WishlistItem = {
      id: `wish-${Date.now()}`,
      miniatureId,
      miniature: min,
      targetPrice,
      addedDate: new Date().toISOString().split('T')[0],
      notes
    };
    setUserWishlist(prev => [item, ...prev]);
  };

  const removeFromWishlist = (id: string) => {
    setUserWishlist(prev => prev.filter(w => w.id !== id));
  };

  // Social Lounge handlers
  const toggleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedByCurrentUser;
        return {
          ...post,
          likedByCurrentUser: !isLiked,
          likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
        };
      }
      return post;
    }));
  };

  const addCommentToPost = (postId: string, text: string) => {
    if (!text.trim()) return;
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Você (@colecionador_oficial)',
              text: text.trim(),
              time: 'Agora mesmo'
            }
          ]
        };
      }
      return post;
    }));
  };

  const createCommunityPost = (content: string, type: 'showcase' | 'trade_wtt' | 'mail_call', taggedMiniatureId?: string, imageUrl?: string) => {
    const taggedMin = taggedMiniatureId ? miniatures.find(m => m.id === taggedMiniatureId) : undefined;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: userStore.ownerName,
      authorHandle: '@minha_garagem_oficial',
      authorAvatar: userStore.avatarUrl,
      authorCity: userStore.location,
      timestamp: 'Agora mesmo',
      type,
      content,
      imageUrl: imageUrl || (taggedMin ? taggedMin.imageUrl : undefined),
      taggedMiniatureId,
      taggedMiniatureName: taggedMin ? taggedMin.name : undefined,
      likesCount: 1,
      likedByCurrentUser: true,
      comments: []
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const submitTradeOffer = (postId: string, offer: Omit<TradeOffer, 'id' | 'status' | 'date'>) => {
    const newOffer: TradeOffer = {
      ...offer,
      id: `to-${Date.now()}`,
      status: 'pending',
      date: 'Agora mesmo'
    };

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          tradeOffers: [...(p.tradeOffers || []), newOffer]
        };
      }
      return p;
    }));
  };

  const respondToTradeOffer = (postId: string, offerId: string, status: 'accepted' | 'declined') => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId && p.tradeOffers) {
        return {
          ...p,
          tradeOffers: p.tradeOffers.map(o => o.id === offerId ? { ...o, status } : o)
        };
      }
      return p;
    }));
  };

  // Cart operations
  const addToCart = (listing: StoreListing, miniature: Miniature) => {
    setCart(prev => {
      const existing = prev.find(item => item.listing.id === listing.id);
      if (existing) {
        return prev.map(item => item.listing.id === listing.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { listing, miniature, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (listingId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart(prev => prev.map(item => item.listing.id === listingId ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (listingId: string) => {
    setCart(prev => prev.filter(item => item.listing.id !== listingId));
  };

  const clearCart = () => setCart([]);

  const checkout = (customerData: { name: string; email: string; city: string; paymentMethod: string }) => {
    if (cart.length === 0) return false;

    // Check if any cart item belongs to userStore
    const userStoreItems = cart.filter(c => c.listing.storeId === userStore.id);
    if (userStoreItems.length > 0) {
      const newOrder: StoreOrder = {
        id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        storeId: userStore.id,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerCity: customerData.city,
        date: new Date().toLocaleDateString('pt-BR'),
        items: userStoreItems.map(item => ({
          miniatureName: item.miniature.name,
          brand: item.miniature.brand,
          condition: item.listing.condition,
          price: item.listing.price,
          qty: item.quantity
        })),
        total: userStoreItems.reduce((acc, curr) => acc + curr.listing.price * curr.quantity, 0),
        status: 'Aguardando Pagamento'
      };
      setUserStoreOrders(prev => [newOrder, ...prev]);
    }

    clearCart();
    return true;
  };

  const formatPrice = (amountInBRL: number) => {
    if (currency === 'USD') {
      const inUSD = amountInBRL / 5.4;
      return `$ ${inUSD.toFixed(2)}`;
    }
    return `R$ ${amountInBRL.toFixed(2).replace('.', ',')}`;
  };

  return (
    <AppContext.Provider
      value={{
        activeSubdomain,
        setActiveSubdomain,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        selectedBrand,
        setSelectedBrand,
        selectedMiniatureId,
        setSelectedMiniatureId,
        miniatures,
        stores,
        storeListings,
        addStoreListing,
        updateStoreListing,
        removeStoreListing,
        userStore,
        updateUserStore,
        userStoreOrders,
        updateOrderStatus,
        userStoreInquiries,
        replyToInquiry,
        userCollection,
        addToCollection,
        removeFromCollection,
        toggleForTrade,
        userWishlist,
        addToWishlist,
        removeFromWishlist,
        communityPosts,
        toggleLikePost,
        addCommentToPost,
        createCommunityPost,
        submitTradeOffer,
        respondToTradeOffer,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        checkout,
        currency,
        setCurrency,
        formatPrice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
