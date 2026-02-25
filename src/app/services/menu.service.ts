import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  private menuSubject = new BehaviorSubject<MenuItem[]>([]);
  public menu$ = this.menuSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu`).pipe(
      tap((menu) => {
        this.menuSubject.next(menu);
      })
    );
  }

  getMenuItems(): MenuItem[] {
    return this.menuSubject.value;
  }

  buildMenuTree(items: MenuItem[]): MenuItem[] {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    items.forEach((item) => {
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children!.push(itemMap.get(item.id)!);
        }
      } else {
        rootItems.push(itemMap.get(item.id)!);
      }
    });

    return rootItems.sort((a, b) => a.ordem - b.ordem);
  }
}
