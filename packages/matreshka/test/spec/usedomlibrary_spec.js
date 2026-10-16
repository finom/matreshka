import dom from 'src/_dom';
import mq from 'src/_dom/mq';
import useDOMLibrary from 'src/usedomlibrary';

describe('useDOMLibrary function', () => {
  it('allows to change DOM library', () => {
    const dummyLibrary = () => {};
    useDOMLibrary(dummyLibrary);
    expect(dom.$).toEqual(dummyLibrary);
    useDOMLibrary(null);
  });

  it('sets mq as DOM library when falsy is passed', () => {
    useDOMLibrary(null);
    expect(dom.$).toEqual(mq);
  });
});
