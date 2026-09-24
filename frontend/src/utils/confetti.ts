import confetti from 'canvas-confetti';

/**
 * Victory confetti burst for Level 3 completion (Issue #8).
 *
 * Fired exclusively by VictoryModal on mount so the effect triggers
 * exactly once per completed arena run.
 */
const VICTORY_COLORS = ['#00ff9d', '#f0f4fc', '#ffb020'];

export function fireVictoryConfetti(): void {
  const shared = {
    colors: VICTORY_COLORS,
    disableForReducedMotion: true,
    zIndex: 200,
  };

  // Side cannons sweeping inward
  confetti({
    ...shared,
    particleCount: 80,
    spread: 65,
    startVelocity: 45,
    origin: { x: 0.1, y: 0.7 },
  });
  confetti({
    ...shared,
    particleCount: 80,
    spread: 65,
    startVelocity: 45,
    origin: { x: 0.9, y: 0.7 },
  });

  // Follow-up center burst behind the modal
  window.setTimeout(() => {
    confetti({
      ...shared,
      particleCount: 120,
      spread: 100,
      scalar: 1.1,
      origin: { x: 0.5, y: 0.55 },
    });
  }, 220);
}
