'use client';
import { useEffect, useRef } from 'react';

// The home page's live sample: the code below it, run on the bundle the site serves.
export function PromoDemo({ text }) {
  const root = useRef(null);
  useEffect(() => {
    const app = {};
    const start = () => {
      window.Matreshka.bindNode(app, 'x', root.current.querySelectorAll('.in, .out'));
      app.x = text;
    };
    if (window.Matreshka) start();
    else {
      const script = document.createElement('script');
      script.src = '/matreshka.min.js';
      script.onload = start;
      document.head.append(script);
    }
    return () => window.Matreshka?.unbindNode(app, 'x');
  }, [text]);
  return (
    <div className="mk-demo" ref={root}>
      <output className="out" />
      <input className="in" type="text" aria-label="x" />
    </div>
  );
}
