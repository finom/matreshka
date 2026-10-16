// the regexp allows to parse things like "click::x(.y)"
// it's shared between few modules
export default /^([^:]+)::([^()]+)?(?:\((.*)\))?/;
