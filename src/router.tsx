// src/router.tsx
import { 
    createRouter, 
    createRoute, 
    createRootRoute,
  } from '@tanstack/react-router';
  import { ClaimsDashboard } from './pages/ClaimsDashboard';
  import { ClaimSubmissionForm } from './pages/ClaimsSubmissionForm';
  import { ClaimDetails } from './pages/ClaimDetails';
  import { Layout } from './components/Layout';
  
  const rootRoute = createRootRoute({
    component: Layout,
  });
  
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: ClaimsDashboard,
  });
  
  const claimsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'claims',
  });
  
  const claimsIndexRoute = createRoute({
    getParentRoute: () => claimsRoute,
    path: '/',
    component: ClaimsDashboard,
  });
  
  const claimDetailsRoute = createRoute({
    getParentRoute: () => claimsRoute,
    path: '$claimId',
    component: ClaimDetails,
  });
  
  const newClaimRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'claims/new',
    component: ClaimSubmissionForm,
  });
  
  const routeTree = rootRoute.addChildren([
    indexRoute,
    claimsRoute.addChildren([
      claimsIndexRoute,
      claimDetailsRoute,
    ]),
    newClaimRoute,
  ]);
  
  export const router = createRouter({ routeTree });
  
  declare module '@tanstack/react-router' {
    interface Register {
      router: typeof router;
    }
  }
  