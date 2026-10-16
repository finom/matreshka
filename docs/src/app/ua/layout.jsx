import { RootLayout } from '@/components/root-layout';
import { layoutMetadata } from '@/lib/layout-metadata';

export const metadata = layoutMetadata('ua');

export default function Layout({ children }) {
  return <RootLayout code="ua">{children}</RootLayout>;
}
