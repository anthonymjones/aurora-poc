import { Component, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'app-aurora',
  standalone: true,
  template: `<ng-content />`,
  styleUrls: ['./aurora.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'aurora',
    '[style.--color-1]': 'color1()',
    '[style.--color-2]': 'color2()',
    '[style.--color-3]': 'color3()',
    '[style.--color-4]': 'color4()',
    '[style.--aura-size]': 'size()',
    '[style.--aura-speed]': 'speed()'
  }
})
export class AuroraComponent {
  color1 = input<string>('#7efff5');
  color2 = input<string>('#7a5fff');
  color3 = input<string>('#ff6b6b');
  color4 = input<string>('#181818');

  size = input<string>('200%');
  speed = input<string>('15s');
}
