import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PoBreadcrumb,
  PoChartSerie,
  PoChartType,
  PoModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { ApiService } from '../../services/api.service';

interface DashboardResponse {
  tenant?: { nome?: string };
  indicadores: {
    saldoTotal: number;
    receitas: number;
    despesas: number;
    saldo: number;
  };
  despesasPorCategoria: Record<string, number>;
  transacoes: Array<{
    tipo: string;
    valor: number;
  }>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PoModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardResponse | null = null;
  isLoading = false;

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Dashboard' }],
  };

  readonly chartType: PoChartType = PoChartType.Donut;

  despesasSeries: PoChartSerie[] = [];

  columns: any[] = [
    { property: 'tipo', label: 'Tipo' },
    { property: 'valor', label: 'Valor', type: 'currency' },
  ];

  constructor(
    private apiService: ApiService,
    private notification: PoNotificationService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  formatCurrency(value: number): string {
    if (value == null) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.apiService.get<any>('dashboard').subscribe({
      next: (data) => {
        this.dashboard = data;
        this.despesasSeries = this.buildCategoryChartSeries(data.despesasPorCategoria);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
        this.notification.error('Nao foi possivel carregar o dashboard.');
        this.isLoading = false;
      },
    });
  }

  private buildCategoryChartSeries(values: Record<string, number>): PoChartSerie[] {
    if (!values) {
      return [];
    }

    return Object.entries(values).map(([label, value]) => ({
      label,
      data: value,
      tooltip: `${label}: ${this.formatCurrency(value)}`,
    }));
  }
}
