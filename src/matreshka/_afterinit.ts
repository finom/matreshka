import type { AnyObject } from '../types.js';

// Matreshka initializer
export default function afterMatreshkaInit(this: AnyObject): void {
  this.nodes = {};
  this.$nodes = {};
}
