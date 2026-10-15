import type { Metadata } from 'next';
import FavoritosClient from './FavoritosClient';

export const metadata: Metadata = {
  title: 'Mis Favoritos | iTech Peru',
  description: 'Revisa tus equipos y productos tecnológicos favoritos guardados en iTech Peru.',
};

export default function FavoritosRoute() {
  return <FavoritosClient />;
}