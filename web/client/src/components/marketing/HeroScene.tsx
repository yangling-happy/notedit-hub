/** Minimal line-art “writing” animation (SVG stroke-dash). */
export function HeroScene() {
  return (
    <div className="marketing-hero-scene" aria-hidden>
      <svg
        className="marketing-hero-scene-svg"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ruled lines — notebook */}
        <g className="marketing-hero-scene-rules" opacity="0.22">
          <line x1="32" y1="56" x2="368" y2="56" />
          <line x1="32" y1="96" x2="368" y2="96" />
          <line x1="32" y1="136" x2="368" y2="136" />
          <line x1="32" y1="176" x2="368" y2="176" />
          <line x1="32" y1="216" x2="368" y2="216" />
          <line x1="32" y1="256" x2="368" y2="256" />
        </g>
        {/* “Ink” lines — drawn in sequence */}
        <path
          className="marketing-hero-scene-stroke marketing-hero-scene-stroke--a"
          d="M48 118 C90 108 130 128 168 118 S240 98 288 112 S340 108 352 114"
          strokeLinecap="round"
        />
        <path
          className="marketing-hero-scene-stroke marketing-hero-scene-stroke--b"
          d="M52 158 C100 148 150 168 200 156 S280 146 332 162"
          strokeLinecap="round"
        />
        <path
          className="marketing-hero-scene-stroke marketing-hero-scene-stroke--c"
          d="M56 198 Q120 188 180 200 T300 192 Q340 188 348 196"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
