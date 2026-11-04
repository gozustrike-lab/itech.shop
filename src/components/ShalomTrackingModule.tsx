'use client';

import { useState } from 'react';
import { Search, ExternalLink, Copy, Check, Truck, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';

interface ShalomTrackingModuleProps {
  className?: string;
  defaultGuideNumber?: string;
}

export default function ShalomTrackingModule({
  className = '',
  defaultGuideNumber = '',
}: ShalomTrackingModuleProps) {
  const [guideNumber, setGuideNumber] = useState(defaultGuideNumber);
  const [copied, setCopied] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGuide = guideNumber.trim();
    if (cleanGuide) {
      navigator.clipboard?.writeText(cleanGuide);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    }
    // Open official Shalom tracking in a new tab
    window.open('https://shalom.com.pe/rastrea/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="rastreo-shalom"
      className={`rounded-3xl bg-gradient-to-br from-[#0B101D] via-[#0E1526] to-[#0A0E1A] border border-red-500/30 p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-red-600/30 flex-shrink-0">
              SH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  Shalom Empresarial
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Rastreo en Vivo
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Seguimiento Oficial de Envíos Nacionales
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-turquoise-400" />
            <span>Paquete 100% asegurado</span>
          </div>
        </div>

        {/* Interactive Search Box */}
        <form onSubmit={handleTrack} className="max-w-2xl mx-auto mb-8">
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Ingresa tu número de Guía Shalom (Guía de Remisión):
          </label>

          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/[0.04] p-1.5 rounded-2xl border border-white/15 focus-within:border-red-500/60 transition-colors">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={guideNumber}
                onChange={(e) => setGuideNumber(e.target.value)}
                placeholder="Ej: 001-049821 ó 8 dígitos..."
                className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-zinc-500 text-sm font-mono tracking-wide focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex-shrink-0"
            >
              <span>Rastrear en Shalom</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {copied && (
            <div className="mt-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Número copiado al portapapeles. Pégalo directamente en la web de Shalom.</span>
            </div>
          )}

          <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span>
              Encuentra este número en la esquina superior derecha del comprobante Shalom que te mandamos por WhatsApp.
            </span>
          </p>
        </form>

        {/* 3 Step Visual Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Voucher por WhatsApp</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Apenas dejamos tu caja acolchada en Shalom Lima, te enviamos la foto nítida de la guía con código de barra.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-950/60 text-red-300 border border-red-800/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">En Tránsito Seguro</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                El sistema de Shalom actualiza cada control de ruta interprovincial con fecha y hora exacta de tránsito.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Retiro con tu DNI</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Llegas a tu agencia Shalom con tu DNI físico y el código de entrega para recoger tu equipo 100% seguro.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Assistance Footer */}
        <div className="mt-6 pt-4 text-center text-xs text-zinc-400">
          ¿Tienes alguna duda con el número de remisión de tu paquete?{' '}
          <a
            href="https://wa.me/51907674693?text=Hola%20iTech%20Perú!%20Deseo%20consultar%20por%20el%20estado%20de%20mi%20envío%20por%20Shalom."
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 font-bold hover:underline inline-flex items-center gap-1 ml-1"
          >
            Escríbenos a soporte WhatsApp (+51 907 674 693) →
          </a>
        </div>
      </div>
    </div>
  );
}
