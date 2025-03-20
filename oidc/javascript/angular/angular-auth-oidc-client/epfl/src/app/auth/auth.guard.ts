import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (_, __) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return oidcSecurityService.isAuthenticated$.pipe(
    take(1),
    map(({ isAuthenticated }) => {
      // allow navigation if authenticated
      if (isAuthenticated) {
        return true;
      }

      // Use oidcSecurityService to force log in to route
      // oidcSecurityService.authorize();

      // redirect if not authenticated
      return router.parseUrl('/unauthorized');
    })
  );
};
