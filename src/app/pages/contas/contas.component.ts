import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoModule, PoModalComponent } from '@po-ui/ng-components';
import { ApiService } from '../../services/api.service';
import { FormMetadataService } from '../../services/form-metadata.service';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoModule],
  template: `
    <po-container>
      <po-page-default p-title="Contas">
        <po-button
          p-label="Nova Conta"
          p-icon="ICON_PLUS"
          (p-click)="openForm()"
        ></po-button>

        <po-table
          [p-items]="contas"
          [p-columns]="columns"
          [p-loading]="loading"
        ></po-table>

        <po-modal
          #formModal
          p-title="Formulário de Conta"
          [p-primary-action]="primaryAction"
          [p-secondary-action]="secondaryAction"
        >
          <form>
            <po-input
              [(ngModel)]="formData.nome"
              p-label="Nome"
              p-name="nome"
              p-required
            ></po-input>

            <po-select
              [ngModel]="formData.tipo"
              (ngModelChange)="formData.tipo = $event"
              p-label="Tipo"
              p-name="tipo"
              [p-options]="tipoOptions"
              p-required
            ></po-select>

            <po-number
              [(ngModel)]="formData.saldo"
              p-label="Saldo"
              p-name="saldo"
            ></po-number>

            <po-textarea
              [(ngModel)]="formData.descricao"
              p-label="Descrição"
              p-name="descricao"
            ></po-textarea>
          </form>
        </po-modal>
      </po-page-default>
    </po-container>
  `,
  styles: [],
})
export class ContasComponent implements OnInit {
  @ViewChild('formModal') formModal!: PoModalComponent;

  contas: any[] = [];
  loading = false;
  page = 1;
  pageSize = 10;
  total = 0;
  formData: any = {};
  tipoOptions = [
    { label: 'Corrente', value: 'Corrente' },
    { label: 'Poupança', value: 'Poupança' },
    { label: 'Investimento', value: 'Investimento' },
    { label: 'Cartão', value: 'Cartão' },
  ];

  columns: any[] = [
    { property: 'nome', label: 'Nome' },
    { property: 'tipo', label: 'Tipo' },
    { property: 'saldo', label: 'Saldo', type: 'currency' },
  ];

  primaryAction: any = {
    label: 'Salvar',
    action: () => this.saveAccount(),
  };

  secondaryAction: any = {
    label: 'Cancelar',
    action: () => this.formModal.close(),
  };

  constructor(
    private apiService: ApiService,
    private formMetadataService: FormMetadataService,
  ) {}

  ngOnInit(): void {
    this.loadContas();
  }

  loadContas(): void {
    this.loading = true;
    this.apiService
      .get<any>('contas', { page: this.page, pageSize: this.pageSize })
      .subscribe({
        next: (data) => {
          this.contas = data.items;
          this.total = data.totalRecords;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar contas:', error);
          this.loading = false;
        },
      });
  }

  openForm(): void {
    this.formData = {};
    this.formModal.open();
  }

  saveAccount(): void {
    this.apiService.post('contas', this.formData).subscribe({
      next: () => {
        this.loadContas();
        this.formData = {};
        this.formModal.close();
      },
      error: (error) => {
        console.error('Erro ao salvar conta:', error);
      },
    });
  }
}
