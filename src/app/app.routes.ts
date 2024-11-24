import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'parents',
    loadComponent: () => import('./parents/parents.component')
      .then(m => m.ParentsComponent)
  },
  {
    path: 'children',
    loadComponent: () => import('./children/children.component')
      .then(m => m.ChildrenComponent)
  },
  {
    path: 'sessions',
    loadComponent: () => import('./sessions/sessions.component')
      .then(m => m.SessionsComponent)
  },
  {
    path: 'billing',
    loadComponent: () => import('./billing/billing.component')
      .then(m => m.BillingComponent)
  },
  {
    path: '',
    redirectTo: '/parents',
    pathMatch: 'full'
  }
];