import { RootLayout } from '@/components/root-layout';
import { layoutMetadata } from '@/lib/layout-metadata';

export const metadata = layoutMetadata('en');

export default function Layout({ children }) {
  return <RootLayout code="en">{children}</RootLayout>;
}
