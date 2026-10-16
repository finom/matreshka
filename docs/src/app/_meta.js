// The English sidebar. The Ukrainian and Russian trees have their own `_meta.js` and layouts.
export default {
  index: { title: 'Home', theme: { breadcrumb: false } },
  '-- guide': { type: 'separator', title: 'Guide' },
  introduction: 'Introduction',
  'getting-started': 'Getting started',
  examples: 'Examples',
  faq: 'FAQ',
  '-- api': { type: 'separator', title: 'API reference' },
  api: { title: 'API reference', display: 'children' },
  ua: { display: 'hidden' },
  ru: { display: 'hidden' }
};
