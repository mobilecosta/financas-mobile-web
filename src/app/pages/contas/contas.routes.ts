import { Routes } from '@angular/router';

export const CONTAS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./contas.component').then((c) => c.ContasComponent),
      },
    ],
  },
];
