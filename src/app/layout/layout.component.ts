import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule, PoToolbarAction, PoMenuItem } from '@po-ui/ng-components';
import { MenuService, MenuItem } from '../services/menu.service';
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
  menuItems: Array<PoMenuItem> = [];

  toolbarActions: PoToolbarAction[] = [
    {
      icon: 'po-icon-exit',
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
        this.menuItems = this.convertToPoMenu(menu);
      },
      error: (error) => {
        console.error('Erro ao carregar menu:', error);
      },
    });
  }

  private convertToPoMenu(items: MenuItem[]): Array<PoMenuItem> {
    const menuTree = this.menuService.buildMenuTree(items);
    return this.mapToPoMenu(menuTree);
  }

  private mapToPoMenu(items: MenuItem[]): Array<PoMenuItem> {
    return items.map(item => ({
      label: item.label,
      icon: this.convertIcon(item.icon),
      link: item.rota || undefined,
      subItems: item.children && item.children.length > 0 
        ? this.mapToPoMenu(item.children) 
        : undefined
    }));
  }

  private convertIcon(icon: string | undefined): string {
    if (!icon) return 'po-icon-folder';
    
    const iconMap: { [key: string]: string } = {
      'po-icon-home': 'po-icon-home',
      'po-icon-finance': 'po-icon-finance',
      'po-icon-bank': 'po-icon-bank',
      'po-icon-bank-account': 'po-icon-bank',
      'po-icon-tags': 'po-icon-tags',
      'po-icon-chart': 'po-icon-chart',
      'po-icon-chart-bar': 'po-icon-chart',
      'po-icon-settings': 'po-icon-settings',
      'po-icon-user': 'po-icon-user',
      'po-icon-lock': 'po-icon-lock',
      'po-icon-document': 'po-icon-document',
    };
    
    return iconMap[icon] || 'po-icon-folder';
  }

  logout(): void {
    this.authService.logout();
  }
}
