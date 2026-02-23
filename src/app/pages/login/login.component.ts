import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AuthService } from '../../services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PoModule, PoTemplatesModule],
  template: `
    <div class="login-page">
      <po-page-login
        p-product-name="Financas Mobile"
        (p-login-submit)="login($event)"
      >
        <div class="login-footer">
          <p>
            Não tem uma conta?
            <a (click)="goToRegister()" class="register-link">Registre-se aqui</a>
          </p>
        </div>
      </po-page-login>
    </div>
  `,
  styles: [`
    .login-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }

    .login-footer p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .register-link {
      color: #0066cc;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
      margin-left: 5px;
    }

    .register-link:hover {
      text-decoration: underline;
    }
  `],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(event: any): void {
    const { login, password } = event;

    this.authService.login(login, password, environment.tenantId).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
