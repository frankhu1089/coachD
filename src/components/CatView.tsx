export type CatExpression = 'neutral' | 'sideEye' | 'dramatic' | 'armsCrossed' | 'clipboard' | 'gentleSmile'

interface Props {
  expression: CatExpression
  size?: number
}

const CAT_BROWN = '#C4956A'
const CAT_EAR = '#E8B09A'
const DARK = '#3D2B1A'
const DARKEST = '#1A0F08'

// Translate normalized SwiftUI coords (0-1) to SVG paths using a 100x100 viewBox
function p(x: number, y: number) {
  return `${x * 100},${y * 100}`
}

function Eyes({ expr }: { expr: CatExpression }) {
  if (expr === 'neutral') return (
    <>
      <ellipse cx="36" cy="49" rx="8" ry="7" fill={DARK} />
      <ellipse cx="64" cy="49" rx="8" ry="7" fill={DARK} />
      <ellipse cx="33" cy="48" rx="2.5" ry="2.5" fill="white" opacity="0.8" />
      <ellipse cx="61" cy="48" rx="2.5" ry="2.5" fill="white" opacity="0.8" />
    </>
  )

  if (expr === 'sideEye') return (
    <>
      {/* Left eye normal */}
      <ellipse cx="36" cy="49" rx="8" ry="7" fill={DARK} />
      <ellipse cx="33" cy="48" rx="2.5" ry="2.5" fill="white" opacity="0.8" />
      {/* Right eye squint */}
      <ellipse cx="65" cy="49" rx="9" ry="5" fill={DARK} />
      {/* Pupil shifted right */}
      <ellipse cx="69" cy="49" rx="3" ry="4" fill={DARKEST} />
      <ellipse cx="70" cy="48.5" rx="1.5" ry="1.5" fill="white" opacity="0.8" />
      {/* Raised eyebrow */}
      <path d={`M 56,38 Q 65,34 74,36`} stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  )

  if (expr === 'dramatic') return (
    <>
      {/* Wide shocked eyes */}
      <ellipse cx="35" cy="49" rx="9" ry="9" fill="white" />
      <ellipse cx="65" cy="49" rx="9" ry="9" fill="white" />
      <ellipse cx="35" cy="49" rx="9" ry="9" stroke={DARK} strokeWidth="1.5" fill="none" />
      <ellipse cx="65" cy="49" rx="9" ry="9" stroke={DARK} strokeWidth="1.5" fill="none" />
      {/* Pupils */}
      <ellipse cx="35" cy="49" rx="4" ry="5" fill={DARKEST} />
      <ellipse cx="65" cy="49" rx="4" ry="5" fill={DARKEST} />
    </>
  )

  if (expr === 'armsCrossed') return (
    <>
      {/* Stern narrowed eyes */}
      <ellipse cx="36" cy="48" rx="8" ry="4" fill={DARK} />
      <ellipse cx="64" cy="48" rx="8" ry="4" fill={DARK} />
      {/* Stern eyebrows */}
      <line x1="26" y1="39" x2="44" y2="41" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="41" x2="74" y2="39" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" />
    </>
  )

  if (expr === 'clipboard') return (
    <>
      {/* Focused, right eye slightly squinting */}
      <ellipse cx="36" cy="48" rx="8" ry="6" fill={DARK} />
      <ellipse cx="64" cy="48.5" rx="8" ry="5" fill={DARK} />
      <ellipse cx="33" cy="47" rx="2.5" ry="2.5" fill="white" opacity="0.8" />
    </>
  )

  // gentleSmile — happy curved eyes (arcs)
  return (
    <>
      <path
        d="M 27,50 A 9,9 0 0 0 45,50"
        stroke={DARK} strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M 55,50 A 9,9 0 0 0 73,50"
        stroke={DARK} strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
    </>
  )
}

function Mouth({ expr }: { expr: CatExpression }) {
  if (expr === 'dramatic') return (
    <ellipse cx="50" cy="74" rx="7" ry="5" fill={DARK} />
  )

  if (expr === 'armsCrossed') return (
    // slight frown
    <path d="M 42,72 Q 50,75 58,72" stroke={DARK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  )

  if (expr === 'gentleSmile') return (
    <path d="M 40,70 Q 50,78 60,70" stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
  )

  // neutral / clipboard / sideEye
  return (
    <path d="M 44,70 Q 47,73 50,73 Q 53,73 56,70" stroke={DARK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  )
}

export default function CatView({ expression, size = 120 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Ears behind head */}
      <polygon points={`${p(0.18,0.42)} ${p(0.08,0.12)} ${p(0.38,0.30)}`} fill={CAT_BROWN} />
      <polygon points={`${p(0.82,0.42)} ${p(0.92,0.12)} ${p(0.62,0.30)}`} fill={CAT_BROWN} />
      {/* Ear inner */}
      <polygon points={`${p(0.20,0.40)} ${p(0.13,0.18)} ${p(0.34,0.31)}`} fill={CAT_EAR} opacity="0.7" />
      <polygon points={`${p(0.80,0.40)} ${p(0.87,0.18)} ${p(0.66,0.31)}`} fill={CAT_EAR} opacity="0.7" />

      {/* Head ellipse */}
      <ellipse cx="50" cy="57" rx="40" ry="35" fill={CAT_BROWN} />

      {/* Tabby stripe hints */}
      <path d="M 30,26 C 40,24 60,28 70,26" stroke={CAT_BROWN} strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M 30,32 C 40,30 60,34 70,32" stroke={CAT_BROWN} strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M 30,38 C 40,36 60,40 70,38" stroke={CAT_BROWN} strokeWidth="1.5" fill="none" opacity="0.35" />

      {/* Eyes */}
      <Eyes expr={expression} />

      {/* Nose */}
      <polygon points="50,62 46,67 54,67" fill={CAT_EAR} />

      {/* Mouth */}
      <Mouth expr={expression} />

      {/* Clipboard accessory */}
      {expression === 'clipboard' && (
        <>
          <rect x="72" y="55" width="22" height="28" rx="3" fill="#F5E6C8" stroke="#C4A882" strokeWidth="1" />
          <line x1="75" y1="63.4" x2="91" y2="63.4" stroke="gray" strokeWidth="1" opacity="0.4" />
          <line x1="75" y1="70.4" x2="91" y2="70.4" stroke="gray" strokeWidth="1" opacity="0.4" />
          <line x1="75" y1="77.4" x2="91" y2="77.4" stroke="gray" strokeWidth="1" opacity="0.4" />
        </>
      )}

      {/* Arms crossed */}
      {expression === 'armsCrossed' && (
        <>
          <path d="M 15,88 Q 30,80 55,92" stroke={CAT_BROWN} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M 85,88 Q 70,80 45,92" stroke={CAT_BROWN} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
        </>
      )}
    </svg>
  )
}
