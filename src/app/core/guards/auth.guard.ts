import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = localStorage.getItem('InstituteName');
        const adminUser = localStorage.getItem('Name');

        if (currentUser) {
            // user logged in so return true
            return true;
        }
        else if (adminUser) {
            // Admin logged in so return true

            return true;
        }
        else {
            this.router.navigate(['/account/login']);
            return false;
        }

    }
}
