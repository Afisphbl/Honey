# 0004. Core Storefront Loop and Scroll Hero (Decision Record)

## Context

The Honey storefront requires a signature visual experience that conveys the purity, tactile warmth, and artisanal character of unpasteurized single origin honey. Rather than displaying flat static product imagery, the brand identity centers on an interactive video like animation sequence of honey extraction and pouring, captured in 150 high resolution WebP frames.

The initial layout attempted a split view card with the canvas on one side and the buy box on the other. That arrangement constricted the visual impact of the extraction footage and introduced visual noise through a frame counter badge ("001 / 150") resembling a diagnostic tool rather than a luxury storefront. The design direction was clarified: the canvas must fill the whole header section and viewport, scrolling must scrub the frames cleanly without image numbers, and the buy box must follow sequentially below.

The core engineering challenge is creating a responsive scroll driven sequence that feels fluid while enforcing strict operational limits:
1. Memory must remain bounded under 80MB on consumer devices and mobile phones to prevent tab crashes or performance throttling.
2. Device pixel ratio must be clamped to avoid massive offscreen canvas buffers on high density displays (basis: spec 0001 AC-6 memory safeguards).
3. Frame scrubbing must not trigger expensive React re-render cycles on every pixel of scroll movement, which would cause noticeable frame drops and jank.
4. Users with vestibular sensitivities or reduced motion preferences must not be subjected to forced scroll scrubbing (basis: WCAG 2.1 guideline 2.3.3 and design.md).
5. The slice must function as a true Tracer Bullet, connecting the canvas animation directly to product variant selection, cart persistence in Zustand, and visual cart drawer feedback.

## Options considered

### Option 1: Sticky split view hero card with side by side buy box

A split view layout where the 150 frame canvas scrubber is pinned sticky in a rounded container on one side while the editorial narrative, origin details, and buy box scroll naturally on the other side through a 300vh scroll container.

**Pros**:
- Keeps purchasing controls visible alongside the animation throughout the scroll track.
- Standard online commerce product detail pattern that is familiar to shoppers.

**Cons**:
- Restricts the canvas to a bounded box, diminishing the cinematic grandeur of the raw honey extraction sequence.
- Crowds the viewport on laptop and tablet screens, forcing typography and image to compete for width.

### Option 2: Full screen canvas hero stage with floating transparent header, scroll scrubbed frames without counter numbers, and sequential buy box below

The canvas expands to fill the entire header section and viewport (100vw, 100vh) as a sticky backdrop over a 300vh scroll track. The storefront navigation bar floats transparently at the top with subtle backdrop blur. Scrubbing happens smoothly via requestAnimationFrame as the visitor scrolls, completely omitting frame numbers for a pristine editorial look. As the visitor scrolls past the animation track, the page smoothly transitions into the featured reserve buy box and sensory tasting notes.

**Pros**:
- Delivers maximum visual impact, making the honey extraction feel immersive, viscous, and tactile.
- Removes distracting frame counters, treating the animation as art rather than a technical widget.
- Clean separation of concerns: visual intrigue first, commercial action second.
- Maintains 60fps performance and bounded memory using the existing WindowedFrameCache and requestAnimationFrame loop.

**Cons**:
- Requires visitors to scroll through the animation sequence before reaching the buy box.
- Mobile viewports require a full viewport canvas render, requiring careful DPR clamping.

### Option 3: Full viewport canvas with floating frosted card overlay pinned on top of canvas

The canvas fills the full viewport while a translucent frosted glass card containing product details and the buy button is permanently pinned floating over the lower half of the screen.

**Pros**:
- Combines full width imagery with immediate add to cart availability.

**Cons**:
- The floating card permanently covers significant portions of the honey jar extraction footage.
- Heavy backdrop filter blurs increase GPU composite costs on mobile devices.
- Obscures the subtle amber hues and light refractions in the lower frames.

## Rationale

We selected Option 2 because it delivers an uncompromising luxury brand presence while respecting performance, usability, and accessibility constraints.

Filling the entire header section and viewport allows the single origin harvest footage to showcase the amber glow and natural honey viscosity without artificial card boundaries or borders. Removing the frame number pill ("001 / 150") elevates the tone from an engineering demo to an artisanal editorial publication, honoring the craft principles in `design.md`.

Floating the navigation header with translucent backdrop blur preserves constant access to the cart drawer and brand identity without visually breaking the full bleed imagery. Positioning the buy box and terroir narrative immediately below the hero track establishes a rhythm: visitors first appreciate the physical purity of cold spun extraction, then encounter the Reserve tasting notes, weight selections, and purchasing options.

Technical safeguards remain robust: `useScrollFrame` isolates scroll tracking from React state updates using passive listeners and linear interpolation damping. `WindowedFrameCache` keeps memory usage strictly under 80MB by maintaining an active window of 16 frames around the playback head, and device pixel ratio is strictly clamped at 2.

## References

**Project sources**:
- Root `AGENTS.md`: Tracer Bullet build approach and canvas memory limits (under 80MB, DPR capped at 2)
- Spec `0001-stack-and-architecture`: HTML5 canvas 2D frame pipeline and `WindowedFrameCache` specifications
- Spec `0002-data-model`: Artisanal catalog schema, variant definitions, and deterministic pricing utilities
- Spec `0003-design-system-and-ui-foundation`: OKLCH color tokens, Radix UI `Drawer` primitive, and `QuantitySelector`
- `design.md`: Visual hierarchy, editorial split composition, and viscous motion curves

**Practices & standards**:
- Decoupled canvas animation loop using `requestAnimationFrame` for steady 60fps rendering without React re-renders
- Linear interpolation (lerp) dampening for smooth viscous scroll scrubbing
- Windowed frame cache with generation tracking to prevent memory leaks during rapid scrolling
- WCAG AA accessibility standards and `prefers-reduced-motion` compliance with alternative manual controls

**Links**:
- MDN window.requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
- MDN CanvasRenderingContext2D imageSmoothingEnabled: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
- Radix UI Dialog documentation: https://www.radix-ui.com/primitives/docs/components/dialog
- Next.js Client Components and Hooks: https://nextjs.org/docs/app/building-your-application/rendering/client-components
