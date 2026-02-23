import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(email: string, senha: string, tenantId: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, { email, senha, tenant_id: tenantId })
      .pipe(
        tap((response: any) => {
          this.setUser(response);
        }),
      );
  }

  register(
    email: string,
    senha: string,
    nome: string,
    tenantId: string,
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, {
        email,
        senha,
        nome,
        tenant_id: tenantId,
      })
      .pipe(
        tap((response: any) => {
          this.setUser(response);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setUser(response: any): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    this.currentUserSubject.next(response.usuario);
  }

  private loadUserFromStorage(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.currentUserSubject.next(JSON.parse(usuario));
    }
  }
}
