import { Button } from '@/components/ui/button';

// a link that looks like a button, for MDX pages
export function ButtonLink({ href, variant = 'outline', children }) {
  return (
    <Button asChild variant={variant} size="lg">
      <a href={href}>{children}</a>
    </Button>
  );
}
