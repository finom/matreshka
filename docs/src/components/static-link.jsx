// A link to a file the site serves outside the app (an example, a bundle): a plain page load, no client routing.
export const isStatic = (href) => typeof href === 'string' && /^\/(examples\/|[^/]+\.(js|map|txt|xml)$)/.test(href);
