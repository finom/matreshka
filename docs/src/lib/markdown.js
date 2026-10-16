import { SITE } from '@/lib/site';

// One page as plain Markdown for an LLM: no front matter, imports or JSX, absolute links. Code keeps its text.
export function pageMarkdown(mdx) {
  const kept = [];
  const keep = (text) => `\0${kept.push(text) - 1}\0`;
  return mdx
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^[ \t]*(`{3,})[\s\S]*?^[ \t]*\1[ \t]*$/gm, keep)
    .replace(/(`+)[\s\S]*?[^`]\1(?!`)/g, keep)
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, '')
    .replace(/^<(OldLinks|PromoDemo|Hero)[^>]*\/>$/gm, '')
    .replace(/<div className="mk-buttons">[\s\S]*?<\/div>/g, '')
    .replace(/<Advanced>([\s\S]*?)<\/Advanced>/g, '_$1_')
    .replace(/\\([{}<])/g, '$1')
    .replace(/ \[#[\w-]+\]$/gm, '')
    .replace(/\]\(\/(?!\/)/g, `](${SITE}/`)
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\0(\d+)\0/g, (_, i) => kept[Number(i)])
    .trim();
}
