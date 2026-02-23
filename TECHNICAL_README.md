# Financas Mobile Web - Documentação Técnica

## Visão Geral

Frontend SaaS Multi-Tenant para controle financeiro pessoal, construído com **Angular 21**, **PO UI** e **Standalone Components**.

## Arquitetura

### Stack Tecnológico

- **Framework**: Angular 21
- **Componentes**: Standalone Components
- **UI Library**: PO UI 18 (Tema THF)
- **HTTP Client**: HttpClient com Interceptors
- **Roteamento**: Angular Router
- **Formulários**: Reactive Forms
- **Deploy**: Vercel (Static)

### Estrutura de Diretórios

```
financas-mobile-web/
├── src/
│   ├── app/
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── login/          # Página de login
│   │   │   ├── dashboard/      # Dashboard
│   │   │   └── contas/         # CRUD de contas
│   │   ├── layout/             # Layout principal
│   │   ├── services/           # Serviços
│   │   │   ├── auth.service.ts
│   │   │   ├── api.service.ts
│   │   │   ├── menu.service.ts
│   │   │   └── form-metadata.service.ts
│   │   ├── interceptors/       # Interceptors HTTP
│   │   │   └── jwt.interceptor.ts
│   │   ├── guards/             # Route Guards
│   │   │   └── auth.guard.ts
│   │   ├── app.routes.ts       # Definição de rotas
│   │   └── app.component.ts    # Componente raiz
│   ├── environments/           # Configurações por ambiente
│   ├── assets/                 # Arquivos estáticos
│   ├── styles.scss             # Estilos globais
│   ├── index.html              # HTML principal
│   └── main.ts                 # Ponto de entrada
├── angular.json                # Configuração Angular
├── tsconfig.json               # Configuração TypeScript
└── package.json                # Dependências
```

## Configuração

### Variáveis de Ambiente

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

Para produção, editar `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.financas-mobile.com/api',
};
```

### Instalação

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Executar em desenvolvimento
npm start

# Compilar para produção
npm run build:prod
```

## Componentes Standalone

Todos os componentes são **Standalone**, sem necessidade de módulos:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PoModule],
  template: `...`,
})
export class DashboardComponent {}
```

### Vantagens

- Sem NgModule
- Importações explícitas
- Melhor tree-shaking
- Menor bundle size

## Autenticação

### Fluxo de Login

1. Usuário insere email, senha e tenant_id
2. `AuthService.login()` envia para `/api/auth/login`
3. Backend retorna `access_token` e dados do usuário
4. Token é armazenado em `localStorage`
5. Usuário é redirecionado para `/dashboard`

### JWT Interceptor

Adiciona automaticamente o token em todas as requisições:

```typescript
Authorization: Bearer <token>
```

### Auth Guard

Protege rotas que requerem autenticação:

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard],
}
```

## Serviços

### AuthService

Gerencia autenticação e estado do usuário:

```typescript
authService.login(email, senha, tenantId).subscribe(...)
authService.logout()
authService.isAuthenticated()
authService.getToken()
```

### ApiService

Wrapper genérico para HTTP:

```typescript
apiService.get('contas', { page: 1, pageSize: 10 })
apiService.post('contas', data)
apiService.patch('contas/id', data)
apiService.delete('contas/id')
```

### MenuService

Carrega e estrutura menu dinâmico:

```typescript
menuService.loadMenu().subscribe(menu => {
  const tree = menuService.buildMenuTree(menu);
})
```

### FormMetadataService

Carrega metadata de formulários:

```typescript
formMetadataService.getFormMetadata('contas').subscribe(metadata => {
  const fields = formMetadataService.buildFormFields(metadata);
})
```

## PO UI - Tema THF

### Componentes Principais

- `po-page-default` - Página padrão
- `po-toolbar` - Barra de ferramentas
- `po-menu` - Menu lateral
- `po-table` - Tabela com paginação
- `po-input` - Campo de entrada
- `po-select` - Seletor
- `po-button` - Botão
- `po-modal` - Modal
- `po-info` - Informação

### Tema THF

Incluído em `angular.json`:

```json
"styles": [
  "src/styles.scss",
  "node_modules/@po-ui/ng-templates/css/po-ui-thf.min.css"
]
```

## Roteamento

### Rotas Definidas

```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contas', component: ContasComponent },
    ],
  },
];
```

### Navegação

```typescript
router.navigate(['/dashboard']);
router.navigate(['/contas'], { queryParams: { page: 2 } });
```

## Formulários Dinâmicos

### Metadata do Backend

```json
{
  "entidade": "contas",
  "campos": [
    {
      "name": "nome",
      "label": "Nome da Conta",
      "type": "text",
      "required": true,
      "maxLength": 255
    }
  ]
}
```

### Renderização Dinâmica

```typescript
formMetadataService.getFormMetadata('contas').subscribe(metadata => {
  this.fields = formMetadataService.buildFormFields(metadata);
});
```

## Paginação

### Tabelas com Paginação

```typescript
<po-table
  [p-items]="contas"
  [p-columns]="columns"
  [p-page]="page"
  [p-page-size]="pageSize"
  [p-total]="total"
  (p-page-change)="onPageChange($event)"
></po-table>
```

### Carregamento com Paginação

```typescript
loadContas(): void {
  this.apiService
    .get('contas', { page: this.page, pageSize: this.pageSize })
    .subscribe(data => {
      this.contas = data.items;
      this.total = data.totalRecords;
    });
}
```

## Deploy - Vercel

### Build

```bash
npm run build:prod
```

Gera arquivos em `dist/financas-mobile-web/`

### Configuração Vercel

No `vercel.json` (raiz do monorepo):

```json
{
  "builds": [
    {
      "src": "financas-mobile-web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist/financas-mobile-web" }
    }
  ]
}
```

### Variáveis de Ambiente (Vercel)

Configurar no dashboard:
- `NG_API_URL` → `https://api.financas-mobile.com/api`

## Interceptors

### JWT Interceptor

Adiciona token em requisições autenticadas:

```typescript
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req, next) {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

## Guards

### Auth Guard

Redireciona para login se não autenticado:

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(route, state) {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

## Observables e RxJS

### Padrão Reativo

```typescript
// Service
public contas$ = this.apiService.get('contas').pipe(
  shareReplay(1),
  catchError(error => {
    console.error(error);
    return of([]);
  })
);

// Component
contas$ = this.contasService.contas$;

// Template
<po-table [p-items]="contas$ | async"></po-table>
```

## Boas Práticas

1. **Componentes Standalone** - Sem NgModule
2. **Serviços Injetáveis** - `providedIn: 'root'`
3. **Tipagem Forte** - Usar interfaces e types
4. **Observables** - Usar `async` pipe no template
5. **OnPush Strategy** - Melhor performance
6. **Lazy Loading** - Carregar módulos sob demanda
7. **Error Handling** - Tratar erros em observables

## Troubleshooting

### Erro de CORS

Verificar `environment.ts` - `apiUrl` deve apontar para backend correto

### Token Expirado

Implementar refresh token:

```typescript
// auth.interceptor.ts
if (error.status === 401) {
  return this.authService.refresh().pipe(
    switchMap(() => next.handle(req))
  );
}
```

### Componentes não aparecem

Verificar se `PoModule` está importado no componente standalone

## Próximos Passos

1. Implementar Categorias e Transações
2. Adicionar Relatórios
3. Implementar Gráficos (Chart.js)
4. Adicionar Notificações
5. Implementar PWA
6. Adicionar Testes E2E (Cypress)
