import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';

export type GlowVariant = 'embedded' | 'emissive' | 'subtle' | 'pulse';

@Component({
  selector: 'app-aurora-text',
  standalone: true,
  templateUrl: './aurora-text.component.html',
  styleUrl: './aurora-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aurora-text',
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
  },
})
export class AuroraTextComponent {
  readonly variant = input<GlowVariant>('embedded');
  readonly glowColor = input<string>('hsla(150, 80%, 50%, 0.8)');
  readonly secondaryGlowColor = input<string>('hsla(200, 80%, 60%, 0.6)');
  readonly speed = input<number>(1);
  readonly fontSize = input<string | undefined>(undefined);

  protected readonly hostClasses = computed(() => {
    return `aurora-text aurora-text--${this.variant()}`;
  });

  protected readonly hostStyles = computed(() => {
    const styles: string[] = [
      `--glow-color: ${this.glowColor()}`,
      `--glow-secondary: ${this.secondaryGlowColor()}`,
      `--glow-speed: ${8 / this.speed()}s`,
    ];
    const fs = this.fontSize();
    if (fs) {
      styles.push(`font-size: ${fs}`);
    }
    return styles.join('; ');
  });
}
