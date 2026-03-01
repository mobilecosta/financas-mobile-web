import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  rota?: string;
  ordem: number;
  ativo: boolean;
  parent_id?: string;
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/metadata`;
  private altApiUrl = `${environment.apiUrl}/menudata`;
  private menuSubject = new BehaviorSubject<MenuItem[]>([]);
  public menu$ = this.menuSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu`).pipe(
      catchError((primaryError) => {
        console.warn('Falha ao carregar menu em /metadata/menu. Tentando /menudata/menu.', primaryError);
        return this.http.get<MenuItem[]>(`${this.altApiUrl}/menu`);
      }),
      catchError((secondaryError) => {
        console.warn('Falha ao carregar menu remoto. Aplicando fallback local.', secondaryError);
        return [this.getFallbackMenu()];
      }),

      tap((menu) => {
        this.menuSubject.next(menu);
      }),
    );
  }

  getMenuItems(): MenuItem[] {
    return this.menuSubject.value;
  }

  buildMenuTree(items: MenuItem[]): MenuItem[] {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    items
      .filter((item) => item.ativo !== false)
      .forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
      });

    itemMap.forEach((item) => {
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children!.push(item);
        } else {
          rootItems.push(item);
        }
      } else {
        rootItems.push(item);
      }
    });

    return this.sortTree(rootItems);
  }

  private sortTree(items: MenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => ({
        ...item,
        children: item.children?.length ? this.sortTree(item.children) : [],
      }));
  }

  private getFallbackMenu(): MenuItem[] {
    return [
      {
        id: 'fallback-dashboard',
        label: 'Dashboard',
        icon: 'po-icon-home',
        rota: '/dashboard',
        ordem: 1,
        ativo: true,
        parent_id: undefined,
      },
      {
        id: 'fallback-contas',
        label: 'Contas',
        icon: 'po-icon-finance',
        rota: '/contas',
        ordem: 2,
        ativo: true,
        parent_id: undefined,
      },
    ];
  }
}
