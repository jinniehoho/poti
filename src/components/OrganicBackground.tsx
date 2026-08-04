import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '../theme';

export type OrganicBackgroundVariant =
  | 'home'
  | 'calendar'
  | 'detail'
  | 'form';

type OrganicBackgroundProps = {
  variant: OrganicBackgroundVariant;
};

type BlobColor =
  | 'primaryFaint'
  | 'primarySoft'
  | 'surfaceWarm'
  | 'waterDue';

type BlobPlacement = {
  color: BlobColor;
  opacity: number;
  path: keyof typeof BLOB_PATHS;
  rotation: number;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
};

const BLOB_PATHS = {
  drift:
    'M8 18 C22 -6 62 -8 86 8 C106 22 101 48 84 60 C68 70 77 93 54 101 C28 110 20 83 1 72 C-17 60 -10 31 8 18 Z',
  hollow:
    'M22 -4 C48 -13 91 2 96 28 C101 52 72 58 69 74 C65 93 92 106 74 124 C53 143 21 122 14 101 C7 80 -17 72 -8 48 C-2 30 5 8 22 -4 Z',
  tide:
    'M3 27 C10 2 37 -9 61 6 C78 17 99 11 108 32 C120 60 92 76 73 84 C49 95 30 113 9 96 C-14 78 -9 49 3 27 Z',
  bloom:
    'M18 4 C45 -10 91 8 96 34 C101 60 74 67 79 91 C84 116 56 128 33 109 C11 91 -18 88 -10 56 C-4 34 1 15 18 4 Z',
  cove:
    'M2 20 C17 -2 45 4 61 -5 C83 -16 108 3 104 29 C101 49 79 54 83 72 C88 94 62 111 39 99 C21 90 8 105 -8 90 C-26 73 -14 43 2 20 Z',
} as const;

const PLACEMENTS: Record<
  OrganicBackgroundVariant,
  BlobPlacement[]
> = {
  home: [
    { color: 'primaryFaint', path: 'drift', x: -65, y: -34, scaleX: 2.75, scaleY: 1.9, rotation: -8, opacity: 0.42 },
    { color: 'waterDue', path: 'tide', x: 326, y: 151, scaleX: 1.52, scaleY: 1.64, rotation: 17, opacity: 0.32 },
    { color: 'surfaceWarm', path: 'hollow', x: -62, y: 446, scaleX: 1.88, scaleY: 1.42, rotation: 13, opacity: 0.24 },
    { color: 'primarySoft', path: 'cove', x: 304, y: 616, scaleX: 1.76, scaleY: 1.47, rotation: -19, opacity: 0.24 },
  ],
  calendar: [
    { color: 'waterDue', path: 'bloom', x: 302, y: -58, scaleX: 1.92, scaleY: 1.62, rotation: 18, opacity: 0.34 },
    { color: 'primaryFaint', path: 'cove', x: -69, y: 190, scaleX: 1.76, scaleY: 1.58, rotation: -12, opacity: 0.4 },
    { color: 'primarySoft', path: 'drift', x: 329, y: 421, scaleX: 1.52, scaleY: 1.48, rotation: -21, opacity: 0.22 },
    { color: 'surfaceWarm', path: 'tide', x: -78, y: 633, scaleX: 2.04, scaleY: 1.42, rotation: 14, opacity: 0.22 },
  ],
  detail: [
    { color: 'primarySoft', path: 'hollow', x: -58, y: -70, scaleX: 1.92, scaleY: 1.56, rotation: -17, opacity: 0.3 },
    { color: 'waterDue', path: 'cove', x: 326, y: 207, scaleX: 1.62, scaleY: 1.5, rotation: 21, opacity: 0.3 },
    { color: 'primaryFaint', path: 'bloom', x: -71, y: 420, scaleX: 2.05, scaleY: 1.56, rotation: 10, opacity: 0.36 },
    { color: 'surfaceWarm', path: 'drift', x: 310, y: 625, scaleX: 1.66, scaleY: 1.45, rotation: -14, opacity: 0.2 },
  ],
  form: [
    { color: 'primaryFaint', path: 'tide', x: 302, y: -63, scaleX: 1.85, scaleY: 1.55, rotation: 19, opacity: 0.38 },
    { color: 'surfaceWarm', path: 'drift', x: -70, y: 200, scaleX: 1.92, scaleY: 1.48, rotation: -15, opacity: 0.22 },
    { color: 'waterDue', path: 'hollow', x: 334, y: 401, scaleX: 1.58, scaleY: 1.42, rotation: -22, opacity: 0.28 },
    { color: 'primarySoft', path: 'bloom', x: -77, y: 621, scaleX: 2.08, scaleY: 1.5, rotation: 11, opacity: 0.24 },
  ],
};

const LINE_PATHS: Record<
  OrganicBackgroundVariant,
  string
> = {
  home:
    'M-24 78 C64 28 132 146 219 121 C292 100 318 175 425 141',
  calendar:
    'M-18 298 C62 252 110 338 184 309 C265 278 320 350 421 308',
  detail:
    'M-26 548 C68 490 135 591 218 545 C286 507 336 574 429 539',
  form:
    'M-21 171 C71 112 131 221 216 178 C287 143 336 211 425 176',
};

export default function OrganicBackground({
  variant,
}: OrganicBackgroundProps) {
  const { theme } = useTheme();
  const opacityFactor = theme.isDark ? 0.64 : 1;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.layer}
    >
      <Svg
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 800"
        width="100%"
      >
        {PLACEMENTS[variant].map((blob, index) => (
          <G
            key={`${variant}-${index}`}
            transform={
              `translate(${blob.x} ${blob.y}) ` +
              `rotate(${blob.rotation} 50 50) ` +
              `scale(${blob.scaleX} ${blob.scaleY})`
            }
          >
            <Path
              d={BLOB_PATHS[blob.path]}
              fill={theme.colors[blob.color]}
              fillOpacity={blob.opacity * opacityFactor}
            />
          </G>
        ))}

        <Path
          d={LINE_PATHS[variant]}
          fill="none"
          stroke={theme.colors.primarySoft}
          strokeLinecap="round"
          strokeOpacity={theme.isDark ? 0.2 : 0.34}
          strokeWidth={1.2}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
