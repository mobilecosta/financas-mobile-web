import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PoBreadcrumb,
  PoModalComponent,
  PoModule,
  PoNotificationService,
  PoPageAction,
  PoTableAction,
} from '@po-ui/ng-components';
import { ApiService } from '../../services/api.service';

interface Conta {
  id: string;
  nome: string;
  tipo: string;
  saldo: number;
  descricao?: string;
}

interface ContasResponse {
  items: Conta[];
  totalRecords: number;
}

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoModule],
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.scss',
})
export class ContasComponent implements OnInit {
  @ViewChild('formModal') formModal!: PoModalComponent;

  contas: Conta[] = [];
  loading = false;
  page = 1;
  pageSize = 10;
  total = 0;
  selectedContaId: string | null = null;
  formData: Partial<Conta> = this.createEmptyForm();

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Dashboard', link: '/dashboard' }, { label: 'Contas' }],
  };

  readonly pageActions: PoPageAction[] = [
    {
      label: 'Incluir',
      icon: 'po-icon-plus',
      action: () => this.openCreateForm(),
    },
    {
      label: 'Atualizar',
      icon: 'po-icon-refresh',
      action: () => this.loadContas(),
    },
  ];

  readonly tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
      action: (row: Conta) => this.openEditForm(row),
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: (row: Conta) => this.deleteConta(row),
    },
  ];

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
    { property: 'descricao', label: 'Descricao' },
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
    private notification: PoNotificationService,
  ) {}

  ngOnInit(): void {
    this.loadContas();
  }

  loadContas(): void {
    this.loading = true;
    this.apiService
      .get<ContasResponse>('contas', { page: this.page, pageSize: this.pageSize })
      .subscribe({
        next: (data) => {
          this.contas = data.items || [];
          this.total = data.totalRecords || 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar contas:', error);
          this.notification.error('Nao foi possivel carregar as contas.');
          this.loading = false;
        },
      });
  }

  openCreateForm(): void {
    this.selectedContaId = null;
    this.formData = this.createEmptyForm();
    this.formModal.open();
  }

  openEditForm(conta: Conta): void {
    this.selectedContaId = conta.id;
    this.formData = { ...conta };
    this.formModal.open();
  }

  saveAccount(): void {
    const payload = {
      nome: this.formData.nome?.trim(),
      tipo: this.formData.tipo,
      saldo: Number(this.formData.saldo || 0),
      descricao: this.formData.descricao?.trim() || undefined,
    };

    if (!payload.nome || !payload.tipo) {
      this.notification.warning('Preencha nome e tipo da conta.');
      return;
    }

    const request$ = this.selectedContaId
      ? this.apiService.patch(`contas/${this.selectedContaId}`, payload)
      : this.apiService.post('contas', payload);

    request$.subscribe({
      next: () => {
        this.loadContas();
        this.formData = this.createEmptyForm();
        this.selectedContaId = null;
        this.formModal.close();
        this.notification.success('Conta salva com sucesso.');
      },
      error: (error) => {
        console.error('Erro ao salvar conta:', error);
        this.notification.error('Nao foi possivel salvar a conta.');
      },
    });
  }

  private deleteConta(conta: Conta): void {
    this.apiService.delete(`contas/${conta.id}`).subscribe({
      next: () => {
        this.notification.success('Conta excluida com sucesso.');
        this.loadContas();
      },
      error: (error) => {
        console.error('Erro ao excluir conta:', error);
        this.notification.error('Nao foi possivel excluir a conta.');
      },
    });
  }

  private createEmptyForm(): Partial<Conta> {
    return {
      nome: '',
      tipo: '',
      saldo: 0,
      descricao: '',
    };
  }
}
