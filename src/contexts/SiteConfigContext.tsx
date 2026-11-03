'use client';

import React, { createContext, useContext } from 'react';

export interface SiteConfig {
  _id?: string;
  title?: string;
  companyName?: string;
  tagline?: string;
  description?: string;
  footerText?: string;
  phone?: string;
  schedule?: string;
  whatsapp?: string;
  email?: string;
  nav?: Array<{ label: string; url: string }>;
  social?: Array<{ platform: string; url: string }>;
  logo?: string;
  ogImage?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
}

const defaultSiteConfig: SiteConfig = {
  title: 'iTech Peru',
  companyName: 'iTech Peru',
  tagline: 'Tecnología renovada 100% operativo',
  description: 'iTech Peru es la tienda de tecnología de segunda mano certificada: laptops, smartphones, audio y gaming revisados por técnicos y con testeados al 100%.',
  footerText: 'Compra inteligente: tecnología de segunda mano verificada por técnicos, con boleta de venta y testeado al 100% y envío seguro a todo el Perú.',
  phone: '+51 907 674 693',
  schedule: 'Lun a Sáb: 10:00 - 20:00',
  whatsapp: '51907674693',
  email: 'hola@itechperu.shop',
  social: [
    { platform: 'instagram', url: 'https://instagram.com/itechperu' },
    { platform: 'facebook', url: 'https://facebook.com/itechperu' },
    { platform: 'tiktok', url: 'https://tiktok.com/@itechperu' },
  ],
};

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export function SiteConfigProvider({
  config,
  children,
}: {
  config?: SiteConfig | null;
  children: React.ReactNode;
}) {
  const merged: SiteConfig = {
    ...defaultSiteConfig,
    ...(config || {}),
    whatsapp: (config?.whatsapp || defaultSiteConfig.whatsapp || '').replace(/\D/g, ''),
    phone: config?.phone || defaultSiteConfig.phone,
    email: config?.email || defaultSiteConfig.email,
    schedule: config?.schedule || defaultSiteConfig.schedule,
    footerText: config?.footerText || defaultSiteConfig.footerText,
    title: config?.title || defaultSiteConfig.title,
    description: config?.description || defaultSiteConfig.description,
  };

  return (
    <SiteConfigContext.Provider value={merged}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}
