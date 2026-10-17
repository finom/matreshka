import type { AnyObject, EventEntry } from '../types.js';
import assign from '../_helpers/assign.js';

// who keeps a listener: null for a listener added to the object itself, or a delegation that reached the
// object from a parent along a path ("a@x" and "b@x" may both reach one shared object)
export type Owner = { object: AnyObject; path: string } | null;

const sameOwner = (a: Owner, b: Owner): boolean =>
  a === b || (!!a && !!b && a.object === b.object && a.path === b.path);

// addListener gives every entry its owners
export const ownersOf = (event: EventEntry): Owner[] => event.info.owners;

export function hasOwner(event: EventEntry, owner: Owner): boolean {
  return ownersOf(event).some((existing) => sameOwner(existing, owner));
}

export function addOwner(event: EventEntry, owner: Owner): void {
  if (!hasOwner(event, owner)) {
    event.info = assign({}, event.info, { owners: ownersOf(event).concat([owner]) });
  }
}

// drops the owner; true when nobody keeps the listener any more
export function dropOwner(event: EventEntry, owner: Owner): boolean {
  const rest = ownersOf(event).filter((existing) => !sameOwner(existing, owner));
  event.info = assign({}, event.info, { owners: rest });
  return !rest.length;
}
