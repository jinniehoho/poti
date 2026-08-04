# Bottom Navigation Design QA

- Viewport: 394 x 831
- Reference: `codex-clipboard-9fb3086b-e3fb-4a50-9b2c-633def761992.png`
- Implementation capture: `work/design-qa-bottom-navigation.png`
- Side-by-side comparison: `work/design-qa-bottom-navigation-comparison.png`
- Verified routes: `/`, `/calendar`, `/add-plant`
- Verified interactions: Calendar -> Home -> Add plant -> Home
- Verified visual structure: one connected SVG path with a centered U-shaped notch, raised circular home FAB, equal left/right tab items, theme-derived active/muted colors
- Verified background treatment: transparent outer wrapper with no white rectangular safe-area layer
- Verified responsive behavior: notch center is calculated from the measured tab-bar width
- Browser console errors: none
- TypeScript: `npm exec tsc -- --noEmit` passed

The reference was used for the connected notch silhouette. Existing Poti typography, theme system, routes, swipe behavior, and screen content were intentionally preserved.

---

# Organic Background Design QA

- Source visual truth:
  - `C:/Users/dunun/AppData/Local/Temp/codex-clipboard-92f3cce3-434c-4a3e-86d1-f1664887a7af.png` (`675 x 1200`)
  - `C:/Users/dunun/AppData/Local/Temp/codex-clipboard-e0d833ad-2f8c-4c40-9c5b-a57b8ac72a0f.png` (`676 x 1200`)
- Browser-rendered implementation: `work/design-qa-organic-background-home.png` (`596 x 1120`)
- Combined comparison: `work/design-qa-organic-background-comparison.png`
- CSS viewport: `596 x 1120`, device pixel ratio `1`
- Density normalization: both references and the implementation were proportionally resized to `800px` height in the combined comparison. The references are conceptual contour targets, so shape character and composition were compared rather than pixel-for-pixel placement.
- State: home screen, light theme; empty plant list. Cream and Dark Night rendering were checked separately.
- Primary interactions tested: `/`, `/calendar`, `/add-plant`, theme switch to Dark Night, restoration to the original Cream theme.
- Browser console: no new errors after the final reload.
- TypeScript: `npm exec tsc -- --noEmit` passed.

## Full-view comparison evidence

- The implementation uses asymmetric SVG paths with convex and concave sections, uneven widths, different rotations, and large edge crops.
- No decorative background shape retains a pill, capsule, ellipse, or rounded-rectangle silhouette.
- Muted theme-derived colors and low-opacity overlap preserve the references' quiet abstract tone without obscuring cards or text.
- One thin curved line per screen echoes the references without becoming a competing decorative layer.

## Focused-region comparison

A separate close crop was not needed: the target concerns large full-screen background contours, and all relevant edges, overlaps, line art, cards, and text contrast are legible in the normalized full-view comparison.

## Required fidelity surfaces

- Fonts and typography: unchanged from the existing Poti system; background does not alter hierarchy or wrapping.
- Spacing and layout rhythm: existing screen and card geometry preserved; blobs remain behind content and partially off-screen.
- Colors and visual tokens: only existing `primaryFaint`, `primarySoft`, `surfaceWarm`, and `waterDue` tokens are used; Dark Night opacity is reduced.
- Image quality and asset fidelity: vector paths remain sharp at all supported viewport sizes; no raster scaling artifacts.
- Copy and content: unchanged.

## Findings

No actionable P0, P1, or P2 mismatch remains. No pill-shaped decorative background element was found in Home, Calendar, Add Plant, or Dark Night verification captures.

## Comparison history

- Earlier finding: the first implementation used elongated View shapes with uneven corner radii, which still read as capsules.
- Fix: replaced all View-based blobs with five reusable asymmetric SVG path contours and per-screen transform presets.
- Post-fix evidence: `work/design-qa-organic-background-comparison.png` and browser captures of Home, Calendar, Add Plant, and Dark Night.

## Follow-up polish

No blocking polish item. The deliberately subtle line opacity can be revisited later if physical-device contrast differs from web rendering.

final result: passed
