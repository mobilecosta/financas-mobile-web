import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PoModule],
  template: `
    <po-container>
      <po-page-default p-title="Dashboard">
        <div class="po-row" *ngIf="dashboard">
          <div class="po-md-3">
            <po-info
              p-label="Saldo Total"
              [p-value]="formatCurrency(dashboard.indicadores.saldoTotal)"
            ></po-info>
          </div>
          <div class="po-md-3">
            <po-info
              p-label="Receitas"
              [p-value]="formatCurrency(dashboard.indicadores.receitas)"
            ></po-info>
          </div>
          <div class="po-md-3">
            <po-info
              p-label="Despesas"
              [p-value]="formatCurrency(dashboard.indicadores.despesas)"
            ></po-info>
          </div>
          <div class="po-md-3">
            <po-info
              p-label="Saldo do Mês"
              [p-value]="formatCurrency(dashboard.indicadores.saldo)"
            ></po-info>
          </div>
        </div>

        <po-divider p-label="Transações Recentes"></po-divider>
        <po-table
          [p-items]="dashboard?.transacoes || []"
          [p-columns]="columns"
        ></po-table>
      </po-page-default>
    </po-container>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  dashboard: any;
  columns: any[] = [
    { property: 'descricao', label: 'Descrição' },
    { property: 'tipo', label: 'Tipo' },
    { property: 'valor', label: 'Valor', type: 'currency' },
    { property: 'data_transacao', label: 'Data' },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  formatCurrency(value: number): string {
    if (value == null) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  loadDashboard(): void {
    this.apiService.get<any>('dashboard').subscribe({
      next: (data) => {
        this.dashboard = data;
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
      },
    });
  }
}
