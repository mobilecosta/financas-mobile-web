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
    <div class="login-container">
      <po-page-login
        p-product-name="Financas Mobile"
        (p-login-submit)="login($event)"
      ></po-page-login>
      
      <div class="login-footer">
        <p>
          Não tem uma conta?
          <a (click)="goToRegister()" class="register-link">Clique aqui para se registrar</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    .login-footer {
      text-align: center;
      margin-top: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-footer p {
      margin: 0;
      color: #333;
      font-size: 15px;
    }

    .register-link {
      color: #0066cc;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
      margin-left: 5px;
      border-bottom: 2px solid #0066cc;
    }

    .register-link:hover {
      color: #0052a3;
      border-bottom-color: #0052a3;
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
