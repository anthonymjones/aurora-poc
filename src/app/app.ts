import { Component, signal } from '@angular/core';
import {
  AuroraBackgroundComponent,
  AuroraPreset,
} from './aurora-background/aurora-background.component';
import { AuroraTextComponent, GlowVariant } from './aurora-text/aurora-text.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuroraBackgroundComponent, AuroraTextComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Aurora Borealis');

  protected readonly presets: AuroraPreset[] = ['northern-lights', 'cosmic', 'ocean', 'sunset'];
  protected readonly glowVariants: GlowVariant[] = ['embedded', 'emissive', 'subtle', 'pulse'];

  protected readonly activePreset = signal<AuroraPreset>('northern-lights');
  protected readonly activeGlowVariant = signal<GlowVariant>('embedded');
  protected readonly speed = signal(1);
  protected readonly intensity = signal(1);
  protected readonly softBlur = signal(true);

  protected setPreset(preset: AuroraPreset): void {
    this.activePreset.set(preset);
  }

  protected setGlowVariant(variant: GlowVariant): void {
    this.activeGlowVariant.set(variant);
  }

  protected updateSpeed(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.speed.set(parseFloat(value));
  }

  protected updateIntensity(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.intensity.set(parseFloat(value));
  }

  protected toggleBlur(): void {
    this.softBlur.update((v) => !v);
  }
}
