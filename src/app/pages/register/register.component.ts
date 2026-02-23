import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AuthService } from '../../services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PoModule, PoTemplatesModule],
  template: `
    <po-container class="register-container">
      <div class="register-form">
        <h1>Criar Conta</h1>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <po-input
            formControlName="nome"
            p-label="Nome Completo"
            p-help="Digite seu nome completo"
            [p-required]="true"
            p-error-pattern="O nome é obrigatório e deve ter pelo menos 3 caracteres"
          ></po-input>

          <po-input
            formControlName="email"
            p-label="Email"
            p-type="email"
            p-help="Digite seu email"
            [p-required]="true"
            p-error-pattern="Digite um email válido"
          ></po-input>

          <po-password
            formControlName="senha"
            p-label="Senha"
            p-help="Mínimo 6 caracteres"
            [p-required]="true"
            p-error-pattern="A senha é obrigatória e deve ter pelo menos 6 caracteres"
          ></po-password>

          <po-password
            formControlName="confirmaSenha"
            p-label="Confirmar Senha"
            p-help="Confirme sua senha"
            [p-required]="true"
            p-error-pattern="As senhas não coincidem"
          ></po-password>

          <div class="form-actions">
            <po-button
              p-label="Registrar"
              [p-disabled]="!registerForm.valid || isLoading"
              (p-click)="onSubmit()"
              p-kind="primary"
            ></po-button>

            <po-button
              p-label="Voltar"
              [p-disabled]="isLoading"
              (p-click)="goBack()"
              p-kind="secondary"
            ></po-button>
          </div>
        </form>

        <div class="login-link">
          <p>
            Já tem uma conta?
            <a [routerLink]="['/login']" class="link">Faça login aqui</a>
          </p>
        </div>
      </div>
    </po-container>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .register-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .register-form {
      background: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
      font-size: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .login-link p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .login-link .link {
      color: #667eea;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
    }

    .login-link .link:hover {
      text-decoration: underline;
    }
  `],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmaSenha: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const senha = group.get('senha');
    const confirmaSenha = group.get('confirmaSenha');

    if (senha && confirmaSenha && senha.value !== confirmaSenha.value) {
      confirmaSenha.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }

    return null;
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      return;
    }

    this.isLoading = true;
    const { nome, email, senha } = this.registerForm.value;

    this.authService.register(email, senha, nome, environment.tenantId).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao registrar:', error);
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
