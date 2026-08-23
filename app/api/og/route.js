import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const nodes = [
  [55, 113], [192, 63], [310, 139], [401, 76],
  [100, 265], [237, 240], [355, 284], [433, 240],
  [37, 429], [160, 391], [283, 441], [383, 428],
  [219, 555], [328, 580], [420, 517],
];

const edges = [
  [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],
  [4,5],[5,6],[6,7],[4,9],[5,9],[5,10],[6,10],
  [6,11],[8,9],[9,10],[10,11],[10,12],[11,14],
  [12,13],[13,14],[9,12],[1,4],[2,5],[3,6],
];

const sizes = [5, 4, 6, 3, 5, 7, 5, 3, 3, 6, 8, 5, 4, 3, 4];

async function loadGoogleFont(family, weight) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }
  ).then((r) => r.text());

  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?woff2['"]?\)/);
  if (!match) throw new Error(`woff2 URL not found for ${family} ${weight}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export async function GET() {
  const [spaceGroteskBold, interLight] = await Promise.all([
    loadGoogleFont('Space Grotesk', 700),
    loadGoogleFont('Inter', 300),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: 'radial-gradient(140% 130% at 15% -15%, #1A2456 0%, #0B1020 52%, #060B18 100%)',
        }}
      >
        {/* Left: text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 48px 64px 80px',
            width: 744,
            height: 630,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(43,89,255,0.15)',
              border: '1px solid rgba(43,89,255,0.3)',
              borderRadius: 999,
              padding: '7px 20px 7px 12px',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#5B82FF',
              }}
            />
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: 300,
                letterSpacing: '0.16em',
                color: '#5B82FF',
                textTransform: 'uppercase',
              }}
            >
              AI AUTOMATION STUDIO
            </span>
          </div>

          {/* Brand name + rule + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 84,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              Bharat AI
            </span>
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: 28,
                fontWeight: 300,
                color: '#9AA3BE',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                marginTop: 8,
              }}
            >
              AUTOMATION LABS
            </span>
            <div
              style={{
                width: 56,
                height: 3,
                background: '#2B59FF',
                borderRadius: 2,
                marginTop: 36,
                marginBottom: 28,
              }}
            />
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: 26,
                fontWeight: 300,
                color: 'rgba(246,247,249,0.75)',
                letterSpacing: '0.01em',
                lineHeight: 1.45,
              }}
            >
              AI Automation for Modern Business
            </span>
          </div>

          {/* URL */}
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: 300,
              color: '#9AA3BE',
              letterSpacing: '0.06em',
            }}
          >
            bharataiautomationlabs.com
          </span>
        </div>

        {/* Right: neural network visualization */}
        <div style={{ display: 'flex', width: 456, height: 630 }}>
          <svg
            width="456"
            height="630"
            viewBox="0 0 456 630"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fade gradient: left edge blends into background */}
            <defs>
              <linearGradient id="fadeLeft" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0B1020" />
                <stop offset="40%" stopColor="#0B1020" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Edges */}
            {edges.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a][0]} y1={nodes[a][1]}
                x2={nodes[b][0]} y2={nodes[b][1]}
                stroke="rgba(43,89,255,0.28)"
                strokeWidth="1"
              />
            ))}

            {/* Nodes: glow ring + core */}
            {nodes.map(([cx, cy], i) => {
              const r = sizes[i];
              const isHero = i === 10;
              const isAccent = i % 4 === 0;
              return (
                <g key={i}>
                  <circle
                    cx={cx} cy={cy} r={r + 6}
                    fill={isHero ? 'rgba(43,89,255,0.28)' : 'rgba(43,89,255,0.1)'}
                  />
                  {r >= 6 && (
                    <circle
                      cx={cx} cy={cy} r={r + 11}
                      fill="none"
                      stroke="rgba(43,89,255,0.15)"
                      strokeWidth="1"
                    />
                  )}
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill={isHero ? '#5B82FF' : isAccent ? '#2B59FF' : 'rgba(91,130,255,0.65)'}
                  />
                </g>
              );
            })}

            {/* Left fade overlay */}
            <rect
              x="0" y="0" width="456" height="630"
              fill="url(#fadeLeft)"
            />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Space Grotesk', data: spaceGroteskBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: interLight, weight: 300, style: 'normal' },
      ],
    }
  );
}
