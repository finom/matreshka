import { join } from 'node:path';
import nextra from 'nextra';

const withNextra = nextra({ search: { codeblocks: false } });

export default withNextra({
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Each language has its own root layout, so the 404 page brings its own <html>.
  experimental: { globalNotFound: true },
  // The workspace root, so the hoisted `next` resolves. Nextra aliases the MDX import source to a Turbopack builtin that
  // Next 16 lacks; the alias is root-relative.
  turbopack: {
    root: join(import.meta.dirname, '..'),
    resolveAlias: { 'next-mdx-import-source-file': './src/mdx-components.jsx' }
  }
});
