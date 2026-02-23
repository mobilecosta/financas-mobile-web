import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule, PoToolbarAction } from '@po-ui/ng-components';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PoModule],
  template: `
    <po-toolbar
      p-title="Financas Mobile"
      [p-actions]="toolbarActions"
    ></po-toolbar>
    <div class="po-row">
      <div class="po-md-3">
        <po-menu [p-menus]="menuItems"></po-menu>
      </div>
      <div class="po-md-9">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [],
})
export class LayoutComponent implements OnInit {
  menuItems: any[] = [];

  toolbarActions: PoToolbarAction[] = [
    {
      icon: 'ICON_EXIT',
      label: 'Sair',
      action: () => this.logout(),
    },
  ];

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
