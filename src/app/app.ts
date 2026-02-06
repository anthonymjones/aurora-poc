import { Component, signal, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuroraComponent } from './aurora/aurora.component';

interface GlowElement {
  id: number;
  text: string;
  fontSize: number;
  color: string;
  intensity: number;
  distance: number;
  speed: number;
}

const PRESETS: Record<string, string[]> = {
  'northern-lights': ['#7efff5', '#7a5fff', '#ff6b6b', '#181818'],
  'cosmic': ['#ff00cc', '#3333ff', '#00ccff', '#000033'],
  'ocean': ['#00ffff', '#0099ff', '#0000ff', '#000033'],
  'sunset': ['#ffcc00', '#ff6600', '#cc0066', '#330033'],
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AuroraComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-aurora
      [color1]="colors()[0]"
      [color2]="colors()[1]"
      [color3]="colors()[2]"
      [color4]="colors()[3]"
      [size]="auraSizeString()"
      [speed]="auraSpeedString()"
    >
      <div class="playground-layout">
        <!-- Hero / Glow Elements Area -->
        <div class="glow-stage">
          @for (element of glowElements(); track element.id) {
            <div 
              class="glow-text"
              [style.font-size.rem]="element.fontSize"
              [style.color]="'white'"
              [style.text-shadow]="generateTextShadow(element)"
            >
              {{ element.text }}
            </div>
          }
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
                <input type="range" min="5" max="30" step="1" 
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
            </div>

            <!-- Color Palette -->
            <div class="control-group">
              <h3>Palette</h3>
              <div class="color-pickers">
                @for (color of colors(); track $index) {
                  <input type="color" 
                    [ngModel]="color" 
                    (ngModelChange)="updateColor($index, $event)"
                  >
                }
              </div>
              <div class="presets">
                @for (preset of presetKeys; track preset) {
                  <button (click)="loadPreset(preset)">{{ preset }}</button>
                }
              </div>
            </div>
          </div>

          <hr class="divider">

          <!-- Glow Elements Management -->
          <div class="elements-section">
            <div class="section-header">
              <h3>Glow Elements</h3>
              <button class="add-btn" (click)="addElement()">+ Add Element</button>
            </div>

            <div class="elements-list">
              @for (el of glowElements(); track el.id) {
                <div class="element-row">
                  <div class="element-inputs">
                    <input type="text" [(ngModel)]="el.text" placeholder="Text">
                    <input type="color" [(ngModel)]="el.color" title="Glow Color">
                  </div>
                  
                  <div class="sliders-grid">
                    <div class="slider-control">
                      <label>Size: {{ el.fontSize }}rem</label>
                      <input type="range" min="1" max="10" step="0.5" [(ngModel)]="el.fontSize">
                    </div>
                    <div class="slider-control">
                      <label>Intensity: {{ el.intensity }}ch</label>
                      <input type="range" min="0" max="8" step="0.1" [(ngModel)]="el.intensity">
                    </div>
                    <div class="slider-control">
                      <label>Spread: {{ el.distance }}ch</label>
                      <input type="range" min="0" max="12" step="0.5" [(ngModel)]="el.distance">
                    </div>
                  </div>

                  <button class="remove-btn" (click)="removeElement(el.id)">Remove</button>
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
      gap: 1rem;
      min-height: 40vh;
      text-align: center;
    }

    .glow-text {
      font-weight: 100;
      transition: all 0.3s ease;
      cursor: default;
      user-select: none;
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
    }

    .controls-header {
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .controls-header h2 { margin: 0; font-weight: 200; font-size: 1.8rem; }
    .controls-header p { margin: 0.5rem 0 0; opacity: 0.6; font-size: 0.9rem; }

    .controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
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
      accent-color: var(--aura-1, cyan);
    }

    .color-pickers {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    input[type="color"] {
      background: none;
      border: none;
      width: 40px;
      height: 40px;
      cursor: pointer;
      padding: 0;
      border-radius: 4px; /* Optional visual tweak */
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

    .element-inputs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .element-inputs input[type="text"] {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      color: white;
      font-size: 1rem;
    }

    .sliders-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .slider-control {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    
    .slider-control label {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .remove-btn {
      width: 100%;
      background: rgba(255, 107, 107, 0.1);
      border-color: rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
      font-size: 0.8rem;
      padding: 0.3rem;
    }
    
    @media (max-width: 768px) {
      .controls-grid, .sliders-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class App {
  colors = signal<string[]>(PRESETS['northern-lights']);
  auraSize = signal<number>(200);
  auraSpeed = signal<number>(15);
  
  auraSizeString = computed(() => `${this.auraSize()}%`);
  auraSpeedString = computed(() => `${this.auraSpeed()}s`);
  presetKeys = Object.keys(PRESETS);

  glowElements = signal<GlowElement[]>([
    {
      id: 1,
      text: 'Aura',
      fontSize: 8,
      color: '#ff6b6b',
      intensity: 1,
      distance: 4,
      speed: 0
    },
    {
      id: 2,
      text: 'an experiment in animating color',
      fontSize: 1.5,
      color: '#7a5fff',
      intensity: 0.5,
      distance: 2,
      speed: 0
    }
  ]);

  updateColor(index: number, newColor: string) {
    this.colors.update(c => {
      const newC = [...c];
      newC[index] = newColor;
      return newC;
    });
  }

  loadPreset(name: string) {
    if (PRESETS[name]) {
      this.colors.set([...PRESETS[name]]);
    }
  }

  addElement() {
    const newId = Math.max(...this.glowElements().map(e => e.id), 0) + 1;
    this.glowElements.update(els => [
      ...els,
      {
        id: newId,
        text: 'New Glow',
        fontSize: 3,
        color: '#7efff5',
        intensity: 1,
        distance: 2,
        speed: 0
      }
    ]);
  }

  removeElement(id: number) {
    this.glowElements.update(els => els.filter(e => e.id !== id));
  }

  generateTextShadow(el: GlowElement): string {
    return `0 0 ${el.intensity}ch ${el.color}, 0 0 ${el.distance}ch ${el.color}`;
  }
}
