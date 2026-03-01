import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard.component').then((c) => c.DashboardComponent),
      },
    ],
  },
];
