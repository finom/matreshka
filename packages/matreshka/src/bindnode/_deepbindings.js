// deep bindings ("a.b.c") of every object: [{ key, deepPath, $nodes, bindingSwitcher }]
// unbindNode uses them to remove the tree listeners of exactly these bindings
export default new WeakMap();
