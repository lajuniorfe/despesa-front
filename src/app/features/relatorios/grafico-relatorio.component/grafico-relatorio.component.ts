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
import { CorCategoriaService } from '../../../shared/services/utils/cor-categoria/cor-categoria.service';

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

  constructor(
    private cd: ChangeDetectorRef,
    private corService: CorCategoriaService,
  ) {}

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
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      console.log(textColor);
      const categorias = this.node.children || [];

      const labels = categorias.map((c: any) => c.label.split('----------')[0].trim());

      const totalTipo = this.node.data.total;

      const valoresPercentual = categorias.map((c: any) => {
        const valor = c.data.total;
        return totalTipo > 0 ? Number(((valor / totalTipo) * 100).toFixed(1)) : 0;
      });

      const backgroundColor = labels.map((label: string) =>
        documentStyle.getPropertyValue(this.corService.getCorCss(label)),
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
