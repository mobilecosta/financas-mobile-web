import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AuthService } from '../../services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoModule, PoTemplatesModule],
  template: `
    <po-page-login
      p-product-name="Financas Mobile"
      (p-login-submit)="login($event)"
    ></po-page-login>
  `,
  styles: [],
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
}
