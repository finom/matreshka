import { RootLayout } from '@/components/root-layout';
import { layoutMetadata } from '@/lib/layout-metadata';

export const metadata = layoutMetadata('ru');

export default function Layout({ children }) {
  return <RootLayout code="ru">{children}</RootLayout>;
}
