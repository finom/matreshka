// @vitest-environment node
// Regressions found by the 2026 sweep; the ids are the audit's.
// Importing the packages where there is no DOM: server-side rendering, a test runner without jsdom.

describe('Runtime regressions: no DOM', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('RN-1: imports matreshka without a window', async () => {
    expect(typeof globalThis.window).toBe('undefined');
    const { default: Matreshka } = await import('matreshka');
    expect(typeof Matreshka).toBe('function');
  });

  it('RN-1: imports matreshka/router without a window', async () => {
    const { initRouter } = await import('src/router');
    expect(typeof initRouter).toBe('function');
  });

  it('RN-1: imports matreshka/parse-form without a window', async () => {
    const { parseForm } = await import('src/parse-form');
    expect(typeof parseForm).toBe('function');
  });
});
