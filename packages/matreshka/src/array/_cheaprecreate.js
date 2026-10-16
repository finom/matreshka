// makes cheap array recreation (with no trackBy, with no events, with no item mediator etc)
export default function cheapRecreate(self, newItems = []) {
  const newLength = newItems.length;
  const oldLength = self.length;
  const lengthDiff = oldLength - newLength;

  for (let i = 0; i < newLength; i++) {
    self[i] = newItems[i];
  }

  for (let i = 0; i < lengthDiff; i++) {
    delete self[i + newLength];
  }

  self.length = newLength;

  return self;
}
