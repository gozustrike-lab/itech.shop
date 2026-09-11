import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | iTech Peru',
  description: 'Completa tu compra en iTech Peru. Pago seguro con tarjeta, Yape, Plin o transferencia bancaria. Envío seguro a todo el Perú.',
};

export default function CheckoutRoute() {
  return <CheckoutClient />;
}