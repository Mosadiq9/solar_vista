export default function SectionDivider({ variant = 1, topColor = 'var(--bg-primary)', bottomColor = 'var(--bg-secondary)' }) {
  const paths = {
    1: 'M0,60 C360,0 720,60 1080,0 C1260,30 1380,60 1440,60 L1440,60 L0,60 Z',
    2: 'M0,0 C480,60 960,0 1440,60 L1440,60 L0,60 Z',
  };

  return (
    <div className="section-divider" aria-hidden="true" style={{ backgroundColor: topColor, color: bottomColor }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d={paths[variant] || paths[1]} fill="currentColor" />
      </svg>
    </div>
  );
}
