export type Brand = 
  | 'Hot Wheels'
  | 'Tomica'
  | 'Kaido House'
  | 'Mini GT'
  | 'Inno64'
  | 'Matchbox'
  | 'Tarmac Works'
  | 'Pop Race';

export type RarityTier = 
  | 'Mainline Comum'
  | 'Treasure Hunt (TH)'
  | 'Super Treasure Hunt (STH)'
  | 'Premium / Car Culture'
  | 'Red Line Club (RLC)'
  | 'Kaido House Exclusive'
  | 'Tomica Limited Vintage'
  | 'Chase / Edição Secreta';

export type Condition = 
  | 'Lacrado / Blister Perfeito'
  | 'Blister C-8 (Leve detalhe no cartão)'
  | 'Loose / Solto Perfeito'
  | 'Loose com Detalhe'
  | 'Caixa Acrílica Lacrada';

export interface PricePoint {
  date: string;
  price: number;
  condition: string;
  storeName: string;
}

export interface Miniature {
  id: string;
  name: string;
  brand: Brand;
  scale: string; // e.g. "1:64"
  casting: string; // e.g. "Nissan Skyline GT-R R34"
  year: number;
  series: string; // e.g. "RLC Exclusive"
  color: string;
  wheelsType: string; // e.g. "Real Riders de Borracha"
  hasOpeningParts: boolean;
  openingPartsDetail?: string; // e.g. "Capô abre com motor detalhado"
  packagingType: string; // e.g. "Card Longo com Protetor" or "Caixa Acrílica"
  rarity: RarityTier;
  imageUrl: string;
  description: string;
  lowestPrice: number;
  avgPrice: number;
  highestPrice: number;
  totalQuantityAvailable: number;
  viewsCount: number;
  salesCount: number;
  rating: number; // 1-5
  priceHistory: PricePoint[];
  tags: string[];
}

export interface StoreListing {
  id: string;
  storeId: string;
  storeName: string;
  storeSubdomain: string;
  storeRating: number;
  storeSalesCount: number;
  storeOriginState: string; // SP, RJ, PR, MG
  isVerified: boolean;
  miniatureId: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  condition: Condition;
  notes: string;
  freeShippingAbove?: number;
}

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  bannerStyle: 'gradient' | 'carbon' | 'checkered' | 'racing';
  tagline: string;
}

export interface Store {
  id: string;
  name: string;
  subdomain: string; // e.g. "garagem-diecast" -> garagem-diecast.ligahot.com.br
  ownerName: string;
  rating: number;
  reviewsCount: number;
  totalSales: number;
  location: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  announcement: string;
  isVerified: boolean;
  joinedYear: number;
  theme: StoreTheme;
  shippingPolicies: string;
  badge?: string;
}

export interface CollectionItem {
  id: string;
  miniatureId: string;
  miniature: Miniature;
  condition: Condition;
  acquiredDate: string;
  purchasePrice: number;
  currentMarketPrice: number;
  isForTrade: boolean;
  userNotes: string;
  customPhotoUrl?: string;
}

export interface WishlistItem {
  id: string;
  miniatureId: string;
  miniature: Miniature;
  targetPrice: number;
  addedDate: string;
  notes: string;
}

export interface TradeOffer {
  id: string;
  fromUser: string;
  fromUserAvatar: string;
  offeredItemName: string;
  offeredItemBrand: string;
  offeredItemCondition: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorCity: string;
  timestamp: string;
  type: 'showcase' | 'trade_wtt' | 'mail_call';
  content: string;
  imageUrl?: string;
  taggedMiniatureId?: string;
  taggedMiniatureName?: string;
  likesCount: number;
  likedByCurrentUser?: boolean;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    time: string;
  }>;
  tradeOffers?: TradeOffer[];
}

export interface CartItem {
  listing: StoreListing;
  miniature: Miniature;
  quantity: number;
}

export interface StoreOrder {
  id: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  date: string;
  items: Array<{
    miniatureName: string;
    brand: string;
    condition: string;
    price: number;
    qty: number;
  }>;
  total: number;
  status: 'Aguardando Pagamento' | 'Preparando Envio' | 'Enviado' | 'Entregue';
  trackingCode?: string;
}

export interface StoreInquiry {
  id: string;
  storeId: string;
  customerName: string;
  miniatureName: string;
  message: string;
  date: string;
  status?: 'Aberto' | 'Respondido';
  reply?: string;
  repliedDate?: string;
}
