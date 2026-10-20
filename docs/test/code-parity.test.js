import { describe, expect, it } from 'vitest';
import { pages } from './pages';

// Code blocks of a page, comments dropped, each line trimmed with spaces collapsed, blank lines dropped.
const codeBlocks = (md) =>
  [...md.matchAll(/^(`{3,})(\S*)[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm)].map(([, , lang, code]) => ({
    lang,
    lines: code
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[\s;{}(),])\/\/.*$/gm, '$1')
      .split('\n')
      .map((line) => line.trim().replace(/[ \t]+/g, ' '))
      .filter(Boolean)
  }));

// Strings and HTML text, the parts a translation may change.
const maskText = (line) => line.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '$1$1').replace(/>[^<>]*</g, '><');
const CYRILLIC = /\p{Script=Cyrillic}/u;

describe('docs code blocks', () => {
  // A translated page shows the same code as the English one; only comments and text in strings are translated.
  it('are the same code in every language', () => {
    const english = new Map(pages.filter(({ lang }) => lang === 'en').map((page) => [page.name, codeBlocks(page.md)]));
    for (const { file, name, lang, md } of pages) {
      if (lang === 'en') continue;
      const blocks = codeBlocks(md);
      const expected = english.get(name);
      expect(
        blocks.map((block) => block.lang),
        `${file}: code blocks`
      ).toEqual(expected.map((block) => block.lang));
      blocks.forEach((block, i) => {
        expect(block.lines.length, `${file}, block ${i + 1}: lines`).toBe(expected[i].lines.length);
        block.lines.forEach((line, j) => {
          const en = expected[i].lines[j];
          const translated = line !== en && CYRILLIC.test(line) && maskText(line) === maskText(en);
          if (!translated) expect(line, `${file}, block ${i + 1}, line ${j + 1}`).toBe(en);
        });
      });
    }
  });
});
