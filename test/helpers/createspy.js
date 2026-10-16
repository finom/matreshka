// a spy that calls through and can be called with `new`, as the specs' models are
export default function createSpy(spy = () => {}) {
  return vi.fn(function spyFunction(...args) {
    return spy.apply(this, args);
  });
}
