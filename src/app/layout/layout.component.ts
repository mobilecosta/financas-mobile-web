import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PoModule],
  template: `
    <po-container>
      <po-page-default>
        <po-toolbar p-title="Financas Mobile">
          <po-toolbar-action
            p-icon="po-icon-exit"
            p-label="Sair"
            (p-action)="logout()"
          ></po-toolbar-action>
        </po-toolbar>

        <div class="po-row">
          <div class="po-md-3">
            <po-menu [p-menus]="menuItems"></po-menu>
          </div>
          <div class="po-md-9">
            <router-outlet></router-outlet>
          </div>
        </div>
      </po-page-default>
    </po-container>
  `,
  styles: [],
})
export class LayoutComponent implements OnInit {
  menuItems: any[] = [];

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.menuService.loadMenu().subscribe({
      next: (menu) => {
        this.menuItems = this.menuService.buildMenuTree(menu);
      },
      error: (error) => {
        console.error('Erro ao carregar menu:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
