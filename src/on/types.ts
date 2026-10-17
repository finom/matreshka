import type { AnyObject, EventHandler } from '../types.js';

// event names: one string split by spaces ("change:a change:b"), or an array of names
export type EventNames = string | string[];

// event name -> handler, the object form of on, once, onDebounce and off
export type EventHandlerMap = Record<string, EventHandler>;

// what a delegated listener ("a.b@change") keeps in the info of its internal events
export interface DelegatedData {
  path: string[];
  name: string;
  callback: EventHandler;
  context: any;
  info: Record<string, any>;
  object: AnyObject;
}

// a DOM listener ("click::x(.y)") kept in the info of _bind:KEY and _unbind:KEY events
export interface DomEventData {
  eventName: string;
  selector?: string;
  callback?: (EventHandler & { _callback?: EventHandler; _kind?: string }) | null;
  context?: any;
}
