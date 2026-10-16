// The social card, 1200×630, in `next/og`'s subset of CSS: the logo, the page title and the page address.
export function OgCard({ logo, title, subtitle, footer }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 88px',
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(135deg, #fffde7 0%, #ffffff 45%, #f3e5f5 100%)',
        // Each subset is its own family, or Satori takes the Cyrillic glyphs from the wrong weight.
        fontFamily: 'Inter, "Inter Cyrillic"',
        color: '#333333'
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/og draws plain elements only */}
      <img src={logo} alt="Matreshka.js" width={492} height={140} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {subtitle && <div style={{ fontSize: 32, color: '#7b1fa2' }}>{subtitle}</div>}
        <div style={{ fontSize: title.length > 28 ? 60 : 76, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 28, color: '#2e7d32' }}>{footer}</div>
    </div>
  );
}
