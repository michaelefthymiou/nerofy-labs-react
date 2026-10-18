/* Animated water molecule (H2O, 104.5 degree bond angle).
   Floats, vibrates, has electrons on orbit, and reacts to scroll and
   pointer through CSS variables set on the hero (--hp, --mx, --my). */

const O = { x: 300, y: 250, r: 118 }
const H = [
  { x: 102, y: 403, r: 70, dx: -7.9, dy: 6.1 },
  { x: 498, y: 403, r: 70, dx: 7.9, dy: 6.1 },
]

function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`
}

export default function Molecule() {
  const orbit = ellipsePath(O.x, O.y, 215, 74)
  return (
    <div className="molecule" aria-hidden="true">
      <div className="molecule-parallax">
        <svg viewBox="0 0 600 580" className="molecule-svg" role="presentation">
          <defs>
            <radialGradient id="mol-o" cx="36%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#f4fdff" />
              <stop offset="28%" stopColor="#a9e3f2" />
              <stop offset="62%" stopColor="#3d9ab5" />
              <stop offset="100%" stopColor="#0b2f3c" />
            </radialGradient>
            <radialGradient id="mol-h" cx="36%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#dfe7ee" />
              <stop offset="78%" stopColor="#8796a5" />
              <stop offset="100%" stopColor="#323d48" />
            </radialGradient>
            <radialGradient id="mol-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5fb3cc" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#5fb3cc" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#5fb3cc" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mol-bond" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfe9f1" />
              <stop offset="100%" stopColor="#5d7f8c" />
            </linearGradient>
            <filter id="mol-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <radialGradient id="mol-e" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#bff0ff" />
              <stop offset="100%" stopColor="#5fb3cc" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={O.x} cy={O.y + 40} r="290" fill="url(#mol-glow)" className="mol-glow" />

          <g className="mol-float">
            {/* electron orbits */}
            <g className="mol-orbits">
            {[-18, 42, 102].map((deg, i) => (
              <g key={deg} transform={`rotate(${deg} ${O.x} ${O.y})`} className={`mol-orbit mol-orbit-${i}`}>
                <path d={orbit} fill="none" stroke="rgba(150,215,235,0.28)" strokeWidth="1.2" strokeDasharray="2 7" />
                <circle r="9" fill="url(#mol-e)">
                  <animateMotion dur={`${7 + i * 2.5}s`} repeatCount="indefinite" path={orbit} begin={`${-i * 1.7}s`} />
                </circle>
              </g>
            ))}
            </g>

            {/* bonds */}
            {H.map((h, i) => (
              <g key={i} className={`mol-bond mol-bond-${i}`}>
                <line x1={O.x} y1={O.y} x2={h.x} y2={h.y} stroke="url(#mol-bond)" strokeWidth="30" strokeLinecap="round" />
                <line x1={O.x} y1={O.y} x2={h.x} y2={h.y} stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" />
              </g>
            ))}

            {/* bond angle */}
            <path d="M 198.8 328.4 A 128 128 0 0 0 401.2 328.4" fill="none" stroke="rgba(190,235,248,0.75)" strokeWidth="1.6" strokeDasharray="3 5" className="mol-angle" />
            <text x={O.x} y={O.y + 172} className="mol-charge mol-angle-label">104.5°</text>

            {/* hydrogens (symmetric stretch vibration) */}
            {H.map((h, i) => (
              <g
                key={i}
                className="mol-h"
                style={{ ['--vx' as string]: `${h.dx}px`, ['--vy' as string]: `${h.dy}px` }}
              >
                <circle cx={h.x} cy={h.y} r={h.r} fill="url(#mol-h)" />
                <ellipse cx={h.x - 22} cy={h.y - 26} rx="20" ry="13" fill="#fff" opacity="0.7" filter="url(#mol-blur)" />
                <circle cx={h.x} cy={h.y} r={h.r} fill="none" stroke="rgba(255,255,255,0.18)" />
                <text x={h.x} y={h.y + 12} className="mol-label mol-label-h">H</text>
              </g>
            ))}

            {/* oxygen */}
            <g className="mol-o">
              <circle cx={O.x} cy={O.y} r={O.r} fill="url(#mol-o)" />
              <ellipse cx={O.x - 40} cy={O.y - 46} rx="34" ry="22" fill="#fff" opacity="0.75" filter="url(#mol-blur)" />
              <circle cx={O.x} cy={O.y} r={O.r} fill="none" stroke="rgba(255,255,255,0.2)" />
              <text x={O.x} y={O.y + 18} className="mol-label mol-label-o">O</text>
            </g>

            {/* partial charges */}
            <text x={O.x} y={O.y - O.r - 22} className="mol-charge">δ−</text>
            <text x={H[0].x + 10} y={H[0].y + 108} className="mol-charge">δ+</text>
            <text x={H[1].x - 10} y={H[1].y + 108} className="mol-charge">δ+</text>

          </g>
        </svg>
        <p className="molecule-caption">
          H<sub>2</sub>O
        </p>
      </div>
    </div>
  )
}
