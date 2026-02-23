import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoModule],
  template: `
    <po-container>
      <po-page-login
        p-title="Financas Mobile"
        p-subtitle="Sistema de Controle Financeiro"
        [p-login]="loginForm"
        (p-login-submit)="login($event)"
      ></po-page-login>
    </po-container>
  `,
  styles: [],
})
export class LoginComponent {
  loginForm: any = {
    login: '',
    password: '',
    tenant: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(event: any): void {
    const { login, password, tenant } = event;

    this.authService.login(login, password, tenant).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);
      },
    });
  }
}
