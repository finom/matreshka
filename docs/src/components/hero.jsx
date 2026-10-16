// The full logo, in the light or the dark theme's colors.
export function Hero({ alt }) {
  return (
    <div className="mk-hero">
      {/* biome-ignore lint/performance/noImgElement: a static export serves the SVG as is */}
      <img className="mk-light" src="/logo/matreshka-full-horizontal.svg" alt={alt} width={420} height={120} />
      {/* biome-ignore lint/performance/noImgElement: a static export serves the SVG as is */}
      <img className="mk-dark" src="/logo/matreshka-full-horizontal-dark.svg" alt={alt} width={420} height={120} />
    </div>
  );
}
