import { Button } from '@/components/ui/button';

const LABELS = {
  en: { demo: 'Open demo', source: 'Source' },
  ua: { demo: 'Відкрити демо', source: 'Код' },
  ru: { demo: 'Открыть демо', source: 'Код' }
};

export function ExampleGrid({ children }) {
  return <div className="mk-example-grid my-6 grid gap-4 sm:grid-cols-2">{children}</div>;
}

// one example: what it shows, then a button to run it and a button to read its code
export function ExampleCard({ title, demo, source, lang = 'en', children }) {
  const labels = LABELS[lang];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <h3 className="text-base font-semibold">
        <a href={demo}>{title}</a>
      </h3>
      <div className="mk-example-text flex-1 text-sm">{children}</div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={demo}>{labels.demo}</a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={source}>{labels.source}</a>
        </Button>
      </div>
    </div>
  );
}
