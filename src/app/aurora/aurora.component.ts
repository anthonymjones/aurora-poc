import { Component, ViewEncapsulation, input, computed, effect, inject, Renderer2, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface AuroraLayer {
  color: string;
  x: number;
  y: number;
  spread: number;
  opacity: number;
}

@Component({
  selector: 'app-aurora',
  standalone: true,
  template: `<ng-content />`,
  styleUrls: ['./aurora.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'aurora',
    '[style.--aura-size]': 'size()',
    '[style.--aura-speed]': 'speed()',
    '[style.background-image]': 'backgroundImage()'
  }
})
export class AuroraComponent {
  layers = input<AuroraLayer[]>([]);
  size = input<string>('200%');
  speed = input<string>('15s');

  backgroundImage = computed(() => {
    const layers = this.layers();
    const gradients = layers.map(layer => {
      const colorWithOpacity = `color-mix(in srgb, ${layer.color} ${layer.opacity * 100}%, transparent)`;
      return `radial-gradient(at ${layer.x}% ${layer.y}%, ${colorWithOpacity} 0px, transparent ${layer.spread}%)`;
    });

    return [
      'radial-gradient(transparent 0, transparent 20%)', 
      ...gradients
    ].join(',\n');
  });

  private renderer = inject(Renderer2);
  private doc = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);
  private styleElement: HTMLStyleElement | null = null;

  constructor() {
    effect(() => {
      const layers = this.layers();
      this.updateKeyframes(layers);
    });

    this.destroyRef.onDestroy(() => {
      if (this.styleElement) {
        this.renderer.removeChild(this.doc.head, this.styleElement);
      }
    });
  }

  private updateKeyframes(layers: AuroraLayer[]) {
    if (!this.styleElement) {
      this.styleElement = this.renderer.createElement('style');
      this.renderer.appendChild(this.doc.head, this.styleElement);
    }

    const steps = [0, 25, 50, 75, 100];
    const keyframeContent = steps.map(step => {
      const positions = ['center']; 
      
      layers.forEach((layer, index) => {
        const driftRadius = 15;
        const phase = (step / 100) * Math.PI * 2;
        const layerOffset = (index / layers.length) * Math.PI * 2;
        
        const xDrift = Math.cos(phase + layerOffset) * driftRadius;
        const yDrift = Math.sin(phase + layerOffset) * driftRadius;
        
        const x = Math.max(0, Math.min(100, layer.x + xDrift));
        const y = Math.max(0, Math.min(100, layer.y + yDrift));
        
        positions.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
      });

      return `${step}% { background-position: ${positions.join(', ')}; }`;
    }).join('\n');

    this.styleElement!.textContent = `
      @keyframes aura-dynamic {
        ${keyframeContent}
      }
    `;
  }
}
