import type { Metadata } from 'next';
import CarritoClient from './CarritoClient';

export const metadata: Metadata = {
  title: 'Mi Carrito | iTech Peru',
  description: 'Revisa tu carrito de compras en iTech Peru. Smartphones y tecnología renovada con garantía y envío a todo el Perú.',
};

export default function CarritoRoute() {
  return <CarritoClient />;
}