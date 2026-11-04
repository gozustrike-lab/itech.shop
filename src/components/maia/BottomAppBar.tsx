'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Heart, ShoppingBag, LayoutGrid, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';

export default function BottomAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, favorites } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkHero, setIsDarkHero] = useState(pathname === '/');
  const lastScrollY = useRef(0);

  const isActive = (path: string) => pathname === path;
  const isHome = pathname === '/';

  useEffect(() => {
    const checkDarkHero = () => {
      if (isHome) {
        // Hero is full 100vh, top hero area is dark
        setIsDarkHero(window.scrollY < window.innerHeight - 80);
      } else {
        setIsDarkHero(false);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      checkDarkHero();

      // Always visible near top
      if (currentScrollY < 50) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;
      // Scrolling down -> hide bottom bar (eBay / Instagram pattern)
      if (diff > 8 && currentScrollY > 70) {
        setIsVisible(false);
      }
      // Scrolling up -> show bottom bar
      else if (diff < -8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    checkDarkHero();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isHome]);

  const openCartDrawer = () => window.dispatchEvent(new Event('open-cart-drawer'));

  const tabs = [
    { icon: Home, label: 'Inicio', path: '/', href: '/' },
    { icon: LayoutGrid, label: 'Catálogo', path: '/coleccion', href: '/coleccion' },
    { icon: Heart, label: 'Favoritos', path: '/favoritos', href: '/favoritos', badge: favorites.length },
    { icon: ShoppingBag, label: 'Carrito', path: '/carrito', href: '/carrito', badge: cartCount, drawer: true },
    { icon: Search, label: 'Buscar', path: '/buscar', href: '/buscar' },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      {/* Top ambient glow/border */}
      <div
        className={`absolute -top-px left-0 right-0 h-px transition-colors duration-300 ${
          isDarkHero
            ? 'bg-gradient-to-r from-transparent via-turquoise-500/35 to-transparent'
            : 'bg-gradient-to-r from-transparent via-turquoise-400/25 to-transparent'
        }`}
      />

      <div
        className={`transition-colors duration-300 backdrop-blur-2xl ${
          isDarkHero
            ? 'bg-[#080C14]/80 border-t border-white/10 text-white'
            : 'bg-white/90 border-t border-zinc-200/60 text-foreground'
        }`}
      >
        <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto px-1 py-1.5">
          {tabs.map((tab) => (
            <BottomTab
              key={tab.path}
              icon={tab.icon}
              label={tab.label}
              active={isActive(tab.path)}
              isDark={isDarkHero}
              badge={tab.badge}
              onClick={() => {
                if ('drawer' in tab && tab.drawer) {
                  openCartDrawer();
                } else {
                  router.push(tab.href);
                }
              }}
            />
          ))}
        </div>

        {/* Safe area bottom for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}

// ─── Tab Button Component ────────────────────────────────────

function BottomTab({
  icon: Icon,
  label,
  active,
  isDark,
  badge,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  isDark?: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-0.5 w-full py-1.5 transition-colors"
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        <Icon
          className={`w-5 h-5 transition-colors duration-200 ${
            active
              ? isDark ? 'text-turquoise-400' : 'text-primary'
              : isDark ? 'text-white/50 hover:text-white' : 'text-foreground/40 hover:text-foreground/70'
          }`}
          strokeWidth={active ? 2.5 : 1.8}
          fill={active ? 'currentColor' : 'none'}
        />
        {badge !== undefined && badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full bg-primary text-white text-[10px] font-bold"
          >
            {badge > 99 ? '99+' : badge}
          </motion.span>
        )}
      </div>
      <span
        className={`text-[10px] transition-colors duration-200 tracking-tight ${
          active
            ? isDark ? 'text-turquoise-400 font-bold' : 'text-primary font-bold'
            : isDark ? 'text-white/60' : 'text-foreground/50'
        }`}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="bottomTabIndicator"
          className={`absolute bottom-0 w-8 h-0.5 rounded-full ${
            isDark ? 'bg-turquoise-400 shadow-sm shadow-turquoise-400/50' : 'bg-primary'
          }`}
        />
      )}
    </motion.button>
  );
}
