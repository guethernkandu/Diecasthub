import React from 'react';
import { Globe, Store as StoreIcon, ExternalLink, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SubdomainBar: React.FC = () => {
  const { activeSubdomain, setActiveSubdomain, stores, userStore, setCurrentTab } = useApp();

  const activeStore = stores.find(s => s.subdomain === activeSubdomain);

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-neutral-400">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-medium text-neutral-300">
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>Ambiente Web:</span>
        </span>
        <div className="flex items-center bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-800 font-mono text-neutral-200">
          <span className="text-amber-500 select-none">https://</span>
          <span className="font-semibold text-white">
            {activeSubdomain ? `${activeSubdomain}.ligahot.com.br` : 'www.ligahot.com.br'}
          </span>
          <span className="text-neutral-500">/</span>
        </div>

        {activeSubdomain && (
          <button
            onClick={() => {
              setActiveSubdomain(null);
              setCurrentTab('marketplace');
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline ml-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Voltar ao Portal Principal</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-neutral-500 hidden sm:inline">Navegar por Loja:</span>
        <select
          value={activeSubdomain || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              setActiveSubdomain(null);
              setCurrentTab('marketplace');
            } else {
              setActiveSubdomain(val);
              setCurrentTab('stores');
            }
          }}
          className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded px-2 py-0.5 focus:outline-none focus:border-amber-500"
        >
          <option value="">Portal Principal (ligahot.com.br)</option>
          {stores.map(store => (
            <option key={store.id} value={store.subdomain}>
              {store.name} ({store.subdomain}.ligahot.com.br)
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setActiveSubdomain(userStore.subdomain);
            setCurrentTab('my-store-dashboard');
          }}
          className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 font-medium transition-colors ml-2"
          title="Acessar o painel administrativo da sua loja"
        >
          <StoreIcon className="w-3 h-3 text-amber-500" />
          <span className="hidden md:inline">Minha Loja:</span>
          <span className="underline decoration-dotted">{userStore.subdomain}.ligahot.com.br</span>
        </button>
      </div>
    </div>
  );
};
