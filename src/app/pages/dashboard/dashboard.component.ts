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
              [p-value]="dashboard.indicadores.saldoTotal | currency"
            ></po-info>
          </div>
          <div class="po-md-3">
            <po-info
              p-label="Receitas"
              [p-value]="dashboard.indicadores.receitas | currency"
            ></po-info>
          </div>
          <div class="po-md-3">
            <po-info
              p-label="Despesas"
              [p-value]="dashboard.indicadores.despesas | currency"
            ></po-info>
          </div>
          <div class="po-md-3">
            <po-info
              p-label="Saldo do Mês"
              [p-value]="dashboard.indicadores.saldo | currency"
            ></po-info>
          </div>
        </div>

        <po-page-content p-title="Transações Recentes">
          <po-table
            [p-items]="dashboard?.transacoes || []"
            [p-columns]="columns"
          ></po-table>
        </po-page-content>
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
