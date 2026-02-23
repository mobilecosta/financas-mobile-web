import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/metadata`;
  private menuSubject = new BehaviorSubject<any[]>([]);
  public menu$ = this.menuSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadMenu(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menu`).pipe(
      tap((menu) => {
        this.menuSubject.next(menu);
      }),
    );
  }

  getMenuItems(): any[] {
    return this.menuSubject.value;
  }

  buildMenuTree(items: any[]): any[] {
    const itemMap = new Map();
    const rootItems: any[] = [];

    // Criar mapa de itens
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Construir árvore
    items.forEach((item) => {
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(itemMap.get(item.id));
        }
      } else {
        rootItems.push(itemMap.get(item.id));
      }
    });

    return rootItems.sort((a, b) => a.ordem - b.ordem);
  }
}
