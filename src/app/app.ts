import { Component, signal, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuroraComponent, AuroraLayer } from './aurora/aurora.component';
import JSZip from 'jszip';

const DEFAULT_LAYERS: AuroraLayer[] = [
  { color: '#7efff5', x: 62, y: 9, spread: 50, opacity: 0.8 },
  { color: '#7a5fff', x: 69, y: 60, spread: 50, opacity: 0.8 },
  { color: '#ff6b6b', x: 24, y: 89, spread: 50, opacity: 0.8 },
  { color: '#181818', x: 51, y: 77, spread: 50, opacity: 0.6 },
  { color: '#7efff5', x: 78, y: 92, spread: 50, opacity: 0.8 },
];

const PRESETS: Record<string, AuroraLayer[]> = {
  'northern-lights': DEFAULT_LAYERS,
  'cosmic': [
    { color: '#ff00cc', x: 20, y: 20, spread: 60, opacity: 0.8 },
    { color: '#3333ff', x: 80, y: 80, spread: 60, opacity: 0.8 },
    { color: '#00ccff', x: 50, y: 50, spread: 40, opacity: 0.9 },
    { color: '#000033', x: 10, y: 90, spread: 70, opacity: 0.7 },
  ],
  'ocean': [
    { color: '#00ffff', x: 30, y: 30, spread: 50, opacity: 0.8 },
    { color: '#0099ff', x: 70, y: 70, spread: 50, opacity: 0.8 },
    { color: '#0000ff', x: 50, y: 10, spread: 60, opacity: 0.8 },
    { color: '#000033', x: 90, y: 90, spread: 80, opacity: 0.6 },
  ],
  'sunset': [
    { color: '#ffcc00', x: 20, y: 80, spread: 50, opacity: 0.9 },
    { color: '#ff6600', x: 80, y: 20, spread: 50, opacity: 0.8 },
    { color: '#cc0066', x: 50, y: 50, spread: 60, opacity: 0.8 },
    { color: '#330033', x: 10, y: 10, spread: 70, opacity: 0.7 },
  ],
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AuroraComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-aurora
      [layers]="auroraLayers()"
      [size]="auraSizeString()"
      [speed]="auraSpeedString()"
    >
      <div class="playground-layout">
        <!-- Hero Area -->
        <div class="glow-stage">
           <div class="hero-text">
             <h1 [style.text-shadow]="heroShadow()">Aura</h1>
             <p>an experiment in animating color</p>
           </div>
        </div>

        <!-- Controls -->
        <div class="controls-card">
          <div class="controls-header">
            <h2>Aurora Controls</h2>
            <p>Interactive Playground</p>
          </div>

          <div class="controls-grid">
            <!-- Global Aurora Settings -->
            <div class="control-group">
              <h3>Global Aurora</h3>
              
              <div class="input-row">
                <label>Speed ({{ auraSpeed() }}s)</label>
                <input type="range" min="5" max="60" step="1" 
                  [ngModel]="auraSpeed()" 
                  (ngModelChange)="auraSpeed.set($event)"
                >
              </div>

              <div class="input-row">
                <label>Size ({{ auraSize() }}%)</label>
                <input type="range" min="100" max="400" step="10" 
                  [ngModel]="auraSize()" 
                  (ngModelChange)="auraSize.set($event)"
                >
              </div>

              <div class="presets-row">
                <label>Presets</label>
                <div class="presets">
                  @for (preset of presetKeys; track preset) {
                    <button (click)="loadPreset(preset)">{{ preset }}</button>
                  }
                </div>
              </div>

              <div class="export-row">
                <button class="export-btn" (click)="exportZip()">📦 Export ZIP</button>
              </div>
            </div>
          </div>

          <hr class="divider">

          <!-- Aurora Layers Management -->
          <div class="elements-section">
            <div class="section-header">
              <h3>Aurora Layers</h3>
              <button class="add-btn" (click)="addLayer()">+ Add Layer</button>
            </div>

            <div class="elements-list">
              @for (layer of auroraLayers(); track $index) {
                <div class="element-row">
                  <div class="layer-header">
                    <span class="layer-title">
                      <span class="color-dot" [style.background-color]="layer.color"></span>
                      Layer {{ $index + 1 }}
                    </span>
                    <button class="remove-btn" (click)="removeLayer($index)">Remove</button>
                  </div>
                  
                  <div class="layer-controls">
                    <div class="control-item color-control">
                       <label>Color</label>
                       <input type="color" [(ngModel)]="layer.color">
                    </div>

                    <div class="control-item slider-control">
                      <label>X Pos: {{ layer.x }}%</label>
                      <input type="range" min="0" max="100" step="1" [(ngModel)]="layer.x">
                    </div>
                    <div class="control-item slider-control">
                      <label>Y Pos: {{ layer.y }}%</label>
                      <input type="range" min="0" max="100" step="1" [(ngModel)]="layer.y">
                    </div>
                    <div class="control-item slider-control">
                      <label>Spread: {{ layer.spread }}%</label>
                      <input type="range" min="10" max="90" step="5" [(ngModel)]="layer.spread">
                    </div>
                    <div class="control-item slider-control">
                      <label>Opacity: {{ layer.opacity }}</label>
                      <input type="range" min="0" max="1" step="0.05" [(ngModel)]="layer.opacity">
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </app-aurora>
  `,
  styles: [`
    .playground-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2rem;
    }

    .glow-stage {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 40vh;
      text-align: center;
      pointer-events: none; /* Let clicks pass through to aurora if needed, though inputs need pointer-events auto */
    }

    .hero-text {
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      user-select: none;
    }
    
    .hero-text h1 {
      font-size: 8rem;
      font-weight: 100;
      margin: 0;
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .hero-text p {
      font-size: 1.5rem;
      font-weight: 200;
      opacity: 0.8;
      margin: 1rem 0 0;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    /* Glassmorphism Card */
    .controls-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 2rem;
      color: white;
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      pointer-events: auto;
    }

    .controls-header {
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .controls-header h2 { margin: 0; font-weight: 200; font-size: 1.8rem; }
    .controls-header p { margin: 0.5rem 0 0; opacity: 0.6; font-size: 0.9rem; }

    .controls-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .control-group h3, .section-header h3 {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.8;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .input-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }
    
    .input-row label {
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      opacity: 0.8;
    }

    input[type="range"] {
      width: 100%;
      accent-color: #7efff5;
    }

    .presets-row {
       margin-top: 1rem;
    }

    .presets-row label {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      opacity: 0.8;
    }

    .presets {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
    }

    button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .divider {
      border: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 2rem 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .add-btn {
      background: rgba(126, 255, 245, 0.2);
      border-color: rgba(126, 255, 245, 0.4);
      color: #7efff5;
    }

    .elements-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .element-row {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .layer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .layer-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.5);
    }

    .layer-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .control-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    
    .control-item label {
      font-size: 0.75rem;
      opacity: 0.7;
      white-space: nowrap;
    }

    input[type="color"] {
      background: none;
      border: none;
      width: 100%;
      height: 30px;
      cursor: pointer;
      padding: 0;
      border-radius: 4px; 
    }

    .remove-btn {
      background: rgba(255, 107, 107, 0.1);
      border-color: rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
      font-size: 0.75rem;
      padding: 0.3rem 0.8rem;
      width: auto;
    }

    .export-row {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .export-btn {
      width: 100%;
      background: rgba(126, 255, 245, 0.15);
      border-color: rgba(126, 255, 245, 0.3);
      color: #7efff5;
      font-size: 1rem;
      padding: 0.75rem 1.5rem;
    }

    .export-btn:hover {
      background: rgba(126, 255, 245, 0.25);
    }
  `]
})
export class App {
  auroraLayers = signal<AuroraLayer[]>(structuredClone(DEFAULT_LAYERS));
  auraSize = signal<number>(200);
  auraSpeed = signal<number>(15);
  
  auraSizeString = computed(() => `${this.auraSize()}%`);
  auraSpeedString = computed(() => `${this.auraSpeed()}s`);
  presetKeys = Object.keys(PRESETS);

  heroShadow = computed(() => {
    const layers = this.auroraLayers();
    if (layers.length >= 2) {
        return `0 0 1ch ${layers[2]?.color || layers[0].color}, 0 0 4ch ${layers[1].color}`;
    } else if (layers.length === 1) {
        return `0 0 2ch ${layers[0].color}`;
    }
    return 'none';
  });

  loadPreset(name: string) {
    if (PRESETS[name]) {
      this.auroraLayers.set(structuredClone(PRESETS[name]));
    }
  }

  addLayer() {
    this.auroraLayers.update(layers => [
      ...layers,
      { 
        color: '#ffffff', 
        x: 50, 
        y: 50, 
        spread: 50, 
        opacity: 0.5 
      }
    ]);
  }

  removeLayer(index: number) {
    this.auroraLayers.update(layers => layers.filter((_, i) => i !== index));
  }

  async exportZip() {
    const layers = this.auroraLayers();
    const size = this.auraSizeString();
    const speed = this.auraSpeedString();

    const gradients = layers.map(layer => {
      const colorWithOpacity = `color-mix(in srgb, ${layer.color} ${Math.round(layer.opacity * 100)}%, transparent)`;
      return `    radial-gradient(at ${layer.x}% ${layer.y}%, ${colorWithOpacity} 0px, transparent ${layer.spread}%)`;
    });

    const keyframeSteps = [0, 33.333, 66.666, 100].map(step => {
      const positions = ['center'];
      layers.forEach((layer, index) => {
        let x = layer.x;
        let y = layer.y;
        if (step !== 0 && step !== 100) {
          const seed = index * 137.5;
          const phase = (step / 100) * Math.PI * 2;
          x = (layer.x + Math.sin(phase + seed) * 20 + 100) % 100;
          y = (layer.y + Math.cos(phase + seed) * 20 + 100) % 100;
        }
        positions.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
      });
      return `  ${step}% { background-position: ${positions.join(', ')}; }`;
    }).join('\n');

    const css = `/* Aurora Background - Generated from Aurora POC */
:root {
  --aura-size: ${size};
  --aura-speed: ${speed};
}

.aurora {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background-color: #0d0d0d;
  z-index: -1;
}

.aurora::after {
  content: "";
  position: absolute;
  inset: -10px;
  background-image:
    radial-gradient(transparent 0, transparent 20%),
${gradients.join(',\n')};
  background-size: var(--aura-size) var(--aura-size);
  animation: aura-move var(--aura-speed) ease infinite;
  filter: blur(60px) saturate(150%);
}

@keyframes aura-move {
${keyframeSteps}
}
`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aurora Background</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="aurora"></div>
  <main style="position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <h1 style="color: white; font-family: system-ui; font-size: 4rem; font-weight: 100;">Your Content Here</h1>
  </main>
</body>
</html>
`;

    const readme = `# Aurora Background

Generated from Aurora POC (https://anthonymjones.github.io/aurora-poc/)

## Usage

1. Include styles.css in your project
2. Add a <div class="aurora"></div> element to your HTML
3. Place your content after the aurora div with position: relative; z-index: 1;

## Customization

- --aura-size: Controls the size of the gradient (default: ${size})
- --aura-speed: Controls animation speed (default: ${speed})

## Browser Support

Works in all modern browsers. Uses CSS color-mix() which requires Chrome 111+, Firefox 113+, Safari 16.4+.
`;

    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('README.md', readme);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aurora-background.zip';
    a.click();
    URL.revokeObjectURL(url);
  }
}
