import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Preset color palettes for the aurora effect.
 */
export type AuroraPreset = 'northern-lights' | 'cosmic' | 'ocean' | 'sunset';

/**
 * Individual color stop configuration for a gradient layer.
 */
export interface AuroraColor {
  /** CSS color value */
  color: string;
  /** Position percentage (0-100) */
  position?: number;
}

/**
 * Configuration for a single gradient layer in the aurora.
 */
export interface AuroraLayer {
  /** Gradient type: 'radial' or 'linear' */
  type: 'radial' | 'linear';
  /** Color stops */
  colors: AuroraColor[];
  /** Background size (e.g., '200% 200%') */
  size?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Optional: radial gradient shape (e.g., 'ellipse at 20% 50%') */
  shape?: string;
  /** Optional: linear gradient angle in degrees */
  angle?: number;
}

const PRESETS: Record<AuroraPreset, AuroraLayer[]> = {
  'northern-lights': [
    {
      type: 'radial',
      shape: 'ellipse at 15% 80%',
      colors: [
        { color: 'hsla(150, 80%, 40%, 0.6)', position: 0 },
        { color: 'hsla(150, 80%, 40%, 0)', position: 50 },
      ],
      size: '200% 200%',
      duration: 15,
      delay: 0,
    },
    {
      type: 'radial',
      shape: 'ellipse at 85% 20%',
      colors: [
        { color: 'hsla(180, 70%, 45%, 0.5)', position: 0 },
        { color: 'hsla(180, 70%, 45%, 0)', position: 55 },
      ],
      size: '250% 250%',
      duration: 20,
      delay: -5,
    },
    {
      type: 'radial',
      shape: 'ellipse at 50% 50%',
      colors: [
        { color: 'hsla(270, 60%, 50%, 0.4)', position: 0 },
        { color: 'hsla(270, 60%, 50%, 0)', position: 45 },
      ],
      size: '300% 300%',
      duration: 25,
      delay: -10,
    },
    {
      type: 'radial',
      shape: 'ellipse at 70% 70%',
      colors: [
        { color: 'hsla(130, 75%, 35%, 0.5)', position: 0 },
        { color: 'hsla(130, 75%, 35%, 0)', position: 50 },
      ],
      size: '200% 200%',
      duration: 18,
      delay: -3,
    },
    {
      type: 'radial',
      shape: 'ellipse at 30% 30%',
      colors: [
        { color: 'hsla(200, 80%, 50%, 0.35)', position: 0 },
        { color: 'hsla(200, 80%, 50%, 0)', position: 60 },
      ],
      size: '250% 250%',
      duration: 22,
      delay: -8,
    },
  ],
  cosmic: [
    {
      type: 'radial',
      shape: 'ellipse at 20% 60%',
      colors: [
        { color: 'hsla(280, 90%, 50%, 0.6)', position: 0 },
        { color: 'hsla(280, 90%, 50%, 0)', position: 50 },
      ],
      size: '200% 200%',
      duration: 16,
      delay: 0,
    },
    {
      type: 'radial',
      shape: 'ellipse at 80% 30%',
      colors: [
        { color: 'hsla(320, 80%, 55%, 0.5)', position: 0 },
        { color: 'hsla(320, 80%, 55%, 0)', position: 55 },
      ],
      size: '250% 250%',
      duration: 22,
      delay: -4,
    },
    {
      type: 'radial',
      shape: 'ellipse at 50% 80%',
      colors: [
        { color: 'hsla(240, 70%, 60%, 0.4)', position: 0 },
        { color: 'hsla(240, 70%, 60%, 0)', position: 45 },
      ],
      size: '300% 300%',
      duration: 28,
      delay: -12,
    },
    {
      type: 'radial',
      shape: 'ellipse at 60% 20%',
      colors: [
        { color: 'hsla(200, 90%, 45%, 0.45)', position: 0 },
        { color: 'hsla(200, 90%, 45%, 0)', position: 50 },
      ],
      size: '200% 200%',
      duration: 19,
      delay: -7,
    },
  ],
  ocean: [
    {
      type: 'radial',
      shape: 'ellipse at 25% 70%',
      colors: [
        { color: 'hsla(190, 90%, 40%, 0.6)', position: 0 },
        { color: 'hsla(190, 90%, 40%, 0)', position: 50 },
      ],
      size: '200% 200%',
      duration: 18,
      delay: 0,
    },
    {
      type: 'radial',
      shape: 'ellipse at 75% 25%',
      colors: [
        { color: 'hsla(210, 80%, 50%, 0.5)', position: 0 },
        { color: 'hsla(210, 80%, 50%, 0)', position: 55 },
      ],
      size: '250% 250%',
      duration: 24,
      delay: -6,
    },
    {
      type: 'radial',
      shape: 'ellipse at 50% 50%',
      colors: [
        { color: 'hsla(170, 70%, 45%, 0.4)', position: 0 },
        { color: 'hsla(170, 70%, 45%, 0)', position: 45 },
      ],
      size: '300% 300%',
      duration: 30,
      delay: -15,
    },
    {
      type: 'radial',
      shape: 'ellipse at 80% 80%',
      colors: [
        { color: 'hsla(230, 70%, 55%, 0.35)', position: 0 },
        { color: 'hsla(230, 70%, 55%, 0)', position: 60 },
      ],
      size: '200% 200%',
      duration: 20,
      delay: -3,
    },
  ],
  sunset: [
    {
      type: 'radial',
      shape: 'ellipse at 20% 80%',
      colors: [
        { color: 'hsla(15, 90%, 55%, 0.6)', position: 0 },
        { color: 'hsla(15, 90%, 55%, 0)', position: 50 },
      ],
      size: '200% 200%',
      duration: 14,
      delay: 0,
    },
    {
      type: 'radial',
      shape: 'ellipse at 80% 30%',
      colors: [
        { color: 'hsla(340, 80%, 55%, 0.5)', position: 0 },
        { color: 'hsla(340, 80%, 55%, 0)', position: 55 },
      ],
      size: '250% 250%',
      duration: 20,
      delay: -5,
    },
    {
      type: 'radial',
      shape: 'ellipse at 50% 50%',
      colors: [
        { color: 'hsla(40, 85%, 55%, 0.4)', position: 0 },
        { color: 'hsla(40, 85%, 55%, 0)', position: 45 },
      ],
      size: '300% 300%',
      duration: 26,
      delay: -10,
    },
    {
      type: 'radial',
      shape: 'ellipse at 70% 70%',
      colors: [
        { color: 'hsla(280, 60%, 50%, 0.35)', position: 0 },
        { color: 'hsla(280, 60%, 50%, 0)', position: 60 },
      ],
      size: '200% 200%',
      duration: 22,
      delay: -8,
    },
  ],
};

@Component({
  selector: 'app-aurora-background',
  standalone: true,
  templateUrl: './aurora-background.component.html',
  styleUrl: './aurora-background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aurora-background',
    '[style]': 'hostStyles()',
  },
})
export class AuroraBackgroundComponent {
  readonly preset = input<AuroraPreset>('northern-lights');

  readonly layers = input<AuroraLayer[] | undefined>(undefined);

  /** 1 = normal, 0.5 = half speed, 2 = double speed */
  readonly speed = input<number>(1);

  /** Gradient opacity multiplier (0-2 range recommended) */
  readonly intensity = input<number>(1);

  readonly backgroundColor = input<string>('#0a0a1a');

  readonly softBlur = input<boolean>(true);

  protected readonly resolvedLayers = computed(() => {
    return this.layers() ?? PRESETS[this.preset()] ?? PRESETS['northern-lights'];
  });

  protected readonly backgroundImage = computed(() => {
    return this.resolvedLayers()
      .map((layer) => {
        const stops = layer.colors
          .map((c) => `${c.color}${c.position != null ? ` ${c.position}%` : ''}`)
          .join(', ');

        if (layer.type === 'radial') {
          const shape = layer.shape ?? 'ellipse at 50% 50%';
          return `radial-gradient(${shape}, ${stops})`;
        }
        const angle = layer.angle ?? 45;
        return `linear-gradient(${angle}deg, ${stops})`;
      })
      .join(', ');
  });

  protected readonly backgroundSize = computed(() => {
    return this.resolvedLayers()
      .map((layer) => layer.size ?? '200% 200%')
      .join(', ');
  });

  protected readonly animationCss = computed(() => {
    const speedMult = this.speed();
    return this.resolvedLayers()
      .map((layer, i) => {
        const duration = (layer.duration ?? 15) / speedMult;
        const delay = (layer.delay ?? 0) / speedMult;
        return `aurora-drift-${i} ${duration}s ${delay}s ease-in-out infinite alternate`;
      })
      .join(', ');
  });

  protected readonly keyframesStyle = computed(() => {
    return this.resolvedLayers()
      .map((_, i) => {
        const xStart = 20 + ((i * 17) % 30);
        const yStart = 20 + ((i * 23) % 30);
        const xMid1 = 40 + ((i * 31) % 40);
        const yMid1 = 60 - ((i * 13) % 30);
        const xMid2 = 60 - ((i * 19) % 30);
        const yMid2 = 30 + ((i * 29) % 40);
        const xEnd = 80 - ((i * 11) % 40);
        const yEnd = 70 - ((i * 7) % 30);

        return `
@keyframes aurora-drift-${i} {
  0%   { background-position: ${this._layerPositions(i, xStart, yStart)}; }
  33%  { background-position: ${this._layerPositions(i, xMid1, yMid1)}; }
  66%  { background-position: ${this._layerPositions(i, xMid2, yMid2)}; }
  100% { background-position: ${this._layerPositions(i, xEnd, yEnd)}; }
}`;
      })
      .join('\n');
  });

  protected readonly hostStyles = computed(() => {
    return `--aurora-bg-color: ${this.backgroundColor()}; --aurora-intensity: ${this.intensity()};`;
  });

  private _layerPositions(targetIndex: number, x: number, y: number): string {
    return this.resolvedLayers()
      .map((_, i) => {
        if (i === targetIndex) {
          return `${x}% ${y}%`;
        }
        return `50% 50%`;
      })
      .join(', ');
  }
}
