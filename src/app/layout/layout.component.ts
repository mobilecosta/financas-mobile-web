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
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
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
    return items
      .filter((item) => item.ativo !== false)
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
      .map((item) => {
        const hasChildren = !!item.children?.length;

        return {
          label: item.label,
          shortLabel: this.toShortLabel(item.label),
          icon: this.convertIcon(item.icon),
          link: item.rota ? this.normalizeRoute(item.rota) : undefined,
          subItems: hasChildren ? this.mapToPoMenu(item.children || []) : undefined,
        };
      });
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
      'an an-house-line': 'po-icon-home',
      'an an-chart-bar': 'po-icon-chart',
      'an an-bank': 'po-icon-finance',
      'an an-wallet': 'po-icon-finance',
      'an an-gear': 'po-icon-settings',
    };
    
    return iconMap[icon] || 'po-icon-folder';
  }

  private normalizeRoute(route: string): string {
    if (!route) {
      return '';
    }

    return route.startsWith('/') ? route : `/${route}`;
  }

  private toShortLabel(label: string): string {
    if (!label) {
      return 'Menu';
    }

    const words = label.split(' ').filter(Boolean);

    if (words.length === 1) {
      return words[0].slice(0, 12);
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
