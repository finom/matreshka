---
title: "Introduction"
description: "What Matreshka.js is: two-way binding between plain JavaScript objects and existing HTML, how it works, where it fits and what it is not."
---

# Introduction

Matreshka.js connects JavaScript objects to the HTML a page already has. You bind a property to a DOM node, and from then on they stay in sync. Set the property and the node updates; type into the node and the property changes. There are no templates, no virtual DOM and no build step.

## How it works

Binding a property gives it a getter and a setter. Assigning `app.x = 'hi'` runs the setter, which updates every node bound to `x` and fires a `change:x` event. Computed properties, value transforms and collections are all built on this one mechanism.

## Where it fits

- Pages whose HTML comes from a server: server-rendered sites, CMS themes, older apps. Matreshka adds behavior to that markup without taking it over.
- Widgets and single HTML files: one `<script>` tag from a CDN, no npm, no bundler.
- Existing code: binding works on any plain object, so you can add it one piece at a time.

## What you get

- Two-way binding to inputs, text, attributes and classes
- Computed properties (`calc`) and value transforms (`mediate`)
- Lists that render each item and stay in sync (`Matreshka.Array`)
- Change events, including on nested data
- A router and a form parser

It's about 24 kB gzipped, with TypeScript types included.

## What it isn't

A component framework. It has no JSX, no single-file components and no server rendering. If you build the whole UI in JavaScript from scratch, React or Vue fit better.
