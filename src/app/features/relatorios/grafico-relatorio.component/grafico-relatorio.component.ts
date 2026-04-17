import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-grafico-relatorio',
  imports: [ChartModule],
  templateUrl: './grafico-relatorio.component.html',
  styleUrl: './grafico-relatorio.component.css',
})
export class GraficoRelatorioComponent {
  platformId = inject(PLATFORM_ID);
  @Input() data: any | null = null;
  @Input() options: any | null = null;
  @Input() tipoGraficoExbido: string = '';
  @Input() node: any | null = null;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.exibirGrafico(this.node);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['node'] && this.node) {
      this.exibirGrafico(this.node);
    }
  }

  exibirGrafico(node: any) {
    if (!node) return;

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const categorias = this.node.children || [];

      const labels = categorias.map((c: any) => c.label.split('----------')[0].trim());

      const totalTipo = this.node.data.total;

      const valoresPercentual = categorias.map((c: any) => {
        const valor = c.data.total;
        return totalTipo > 0 ? Number(((valor / totalTipo) * 100).toFixed(2)) : 0;
      });

      const cores = [
        '--p-cyan-500',
        '--p-orange-500',
        '--p-green-500',
        '--p-purple-500',
        '--p-pink-500',
        '--p-blue-500',
        '--p-yellow-500',
        '--p-indigo-500',
        '--p-teal-500',
        '--p-red-500',
      ];

      const backgroundColor = labels.map((_: any, i: number) =>
        documentStyle.getPropertyValue(cores[i % cores.length]),
      );

      this.data = {
        labels: [...labels],
        datasets: [
          {
            data: [...valoresPercentual],
            backgroundColor: [...backgroundColor],
            hoverBackgroundColor: [...backgroundColor],
          },
        ],
      };
      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return context.label + ': ' + context.raw + '%';
              },
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
